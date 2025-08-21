# GreenGuard: Plant Observation & Climate Assistant

Full‑stack app for plant observations, AI plant/disease detection, climate‑informed tree suggestions, endangered species visualization, and expert (ecologist) review workflows.

## Features
- AI plant identification (species)
  - Identify plant species from uploaded images using the species ML model
- Disease detection with cure suggestions
  - Detect plant diseases from images and generate concise, farmer‑friendly cure guidance
- Rewards and leaderboard (EXP = green points)
  - Leaderboard filtered to users; ranger tasks completion awards +25 points
- Ranger assignments
- Realtime plantation verification calls (WebRTC + Socket.IO)
  - Modern, compact UI with controls, picture‑in‑picture, duration, and status
  - STUN only (no TURN), trickle ICE, buffered signaling, clean teardown
- Plant observations and nearby feed
  - Upload with geolocation; ecologist/ranger review flows; approval awards +50 points
  - Nearby list shows species, confidence, image, and normalized coordinates
  - Ecologists assign tasks (e.g., protect endangered sightings, remove threats, verify plantation); rangers mark done and earn rewards
- Endangered species map + table
  - Identify and surface endangered species; ecologist experts validate; map with proper z‑index behavior; species summary table under map
- Profiles and dashboards
  - Real user data (name, email, location, exp); edit profile; mobile‑friendly sidebars
  - Consistent headers: settings → Profile; notification icon removed
- Climate‑based tree suggestions
  - Open‑Meteo climate data + Mistral AI suggestions; reverse geocoding via OpenCage with Nominatim fallback; cache + heuristic fallback
- ML integration (models not deployed here by default — run locally or deploy your own)
  - Species and disease detection services (FastAPI + TensorFlow/PyTorch)
- Deployable ML API on Render (render.yaml included)

- Backend: Node.js + Express + MongoDB + Socket.IO
- Frontend: React (Vite) + Tailwind
- ML services: FastAPI (species + disease)

## Monorepo layout

```
.
├── Server/                # Express API + Socket.IO + MongoDB
│   ├── index.js           # App entry, routes mount, Socket.IO
│   ├── config/            # db.js (Mongo), cloudinary.js
│   ├── controllers/       # auth, observations, ecologist, climate (Mistral + Open‑Meteo + OpenCage)
│   ├── middlewares/       # auth (JWT), multer upload
│   ├── models/            # User, PlantObservation, EcologistReview
│   ├── routes/            # auth, observations, ecologist, climate
│   ├── sockets/           # signaling.js (video-call signaling)
│   ├── utils/             # generateToken, runMLModel
│   └── uploads/           # local image uploads (also uploaded to Cloudinary)
├── frontend/              # React + Vite + Tailwind UI
│   ├── src/
│   │   ├── main.jsx       # Router: /, /udash, /edash, /rangerdash, /login, /signup
│   │   ├── pages/         # Dashboards and auth pages
│   │   ├── components/    # Scan, Detect, Maps, Reviews, etc.
│   │   ├── utils/axios.js # Axios instance uses VITE_API_BASE_URL
│   │   └── socket/        # socket.js (Socket.IO client)
│   └── vite.config.js, tailwind.config.js, postcss.config.js
└── ML/                    # FastAPI services for species/disease
    ├── api1forplant_species.py  # /predict/ (multipart file)
    ├── api2forplant_disease     # /predict (base64 JSON) — see notes
    └── models/                  # Trained model files
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string (Atlas or local)
- Optional: Python 3.10+ (for ML APIs) + pip

## Environment variables

Create a `.env` file in `Server/` with:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-strong-secret

# Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Reverse geocoding (OpenCage)
OPENCAGE_API_KEY=your-opencage-api-key

# Mistral AI (climate tree suggestions)
MISTRAL_API_KEY=your-mistral-api-key
# Optional: Gemini if other features use it
# GEMINI_API_KEY=your-google-genai-api-key
```

Create a `.env` file in `frontend/` with:

```
# Base URL to reach the Server API and Socket.IO
VITE_API_BASE_URL=http://localhost:5000
```

## Install and run

Run server and client in separate terminals.

Backend (Server):

```powershell
cd Server
npm install
npm start
```

Frontend (Vite):

```powershell
cd frontend
npm install
npm run dev
```

Optional ML services (local):

- Species classifier (expects multipart form-data at POST http://localhost:8000/predict/ with `file`):

```powershell
# From ML folder
python -m pip install fastapi uvicorn tensorflow pillow pydantic numpy
python .\api1forplant_species.py
```

- Disease classifier (current code calls POST http://localhost:8000/predict with multipart `file`). If you run `api2forplant_disease`, it expects base64 JSON instead. Either:
  - adjust `Server/utils/runMLModel.js` to send base64 JSON, or
  - wrap the disease API to accept multipart `file` like the species API.

## Server API overview

Mounted in `Server/index.js`:

- /api/auth
  - POST /register → registerUser
  - POST /login → loginUser
  - GET  /profile (auth)

- /api/observations
  - POST / (auth, multipart) → createObservation
    - Body: image (file), latitude, longitude
  - GET  / (auth) → getAllObservations
  - GET  /nearby (auth) → getNearbyObservations?latitude=&longitude=&radiusInKm=
  - GET  /approve/:id (auth) → approveObservation
  - POST /detect (multipart) → detectPlantDisease
  - GET  /endangered → endangered species map data
  - GET  /user (auth) → getUserObservations

- /api/ecologist
  - GET  /pending → getPendingObservations
  - GET  /unconfirmed → getPendingEcologistReviews
  - PUT  /review/:id (auth) → updateObservationReview

- /api/climate
  - POST /suggest-trees → suggestTreesController
    - Body: { latitude, longitude } (server resolves city via OpenCage/Nominatim)
    - Internals: Open‑Meteo + Mistral to suggest species; cached; heuristic fallback on rate‑limit
  - GET  /reverse-geocode?lat=&lon= → { city }

Additional top‑level routes (from `index.js`):

- GET /usersplant (auth) → getUserObservations
- GET /unconfirmed (auth) → getPendingEcologistReviews
- GET /endangered → getEndangeredSpecies

Auth: Bearer token via `Authorization: Bearer <JWT>` header (see `middlewares/authMiddleware.js`).

Uploads: Served from `/uploads` and mirrored to Cloudinary (see `config/cloudinary.js`).

## Socket.IO events (Server/sockets/signaling.js)

- Client connects with query: `userId`, `role` (e.g., `admin` joins "admins" room)
- `user:callRequest` { userId } → emits `admin:callIncoming` to admins
- `admin:acceptCall` { userId } → emits `call:accepted` to both sides
- `webrtc:signal` { signal, to } → relays WebRTC signal
- `call:end` { to } → notifies peer
- `call:cancelled` { userId } → notifies admins; also on disconnect cleanup

Client uses `frontend/src/socket/socket.js` and `VITE_API_BASE_URL`.

## Frontend routes (frontend/src/main.jsx)

- / → HomePage
- /udash → User Dashboard (scanner, disease detection, history, map, rewards)
- /edash → Ecologist Dashboard (reviews, submissions, database, research)
- /rangerdash → Ranger Dashboard
- /login, /signup

Axios base URL comes from `VITE_API_BASE_URL` in `frontend/src/utils/axios.js`.

Key components:

- ScanPlant → POST /api/observations (file + geolocation)
- DiseaseDetector → POST /api/observations/detect (file)
- EndangeredSpeciesMap → GET endangered species data
- ReviewPanel (ecologist) → GET/PUT ecologist endpoints
- SaveEnv → POST /api/climate/suggest-trees (Mistral suggestions; server reverse‑geocodes city)

## Notes on ML integration

`Server/utils/runMLModel.js` calls two endpoints assumed to run locally:

- Species: POST http://localhost:8000/predict/ (multipart form-data, field `file`)
- Disease: POST http://localhost:8000/disease/predict (multipart form-data, field `file`)

The included disease API (`ML/api2forplant_disease`) expects base64 JSON at `/predict`. If you use that file directly, update `runMLModel2` to send base64 JSON; otherwise expose a multipart endpoint that forwards to it.

Climate suggestions use Mistral via `MISTRAL_API_KEY`. Some optional content may use Gemini if present.

## Deployment (ML service on Render)

- `render.yaml` at repo root defines a FastAPI web service for species model:
  - Build: `pip install -r ML/requirements.txt`
  - Start: `uvicorn ML.api1forplant_species:app --host 0.0.0.0 --port $PORT --workers 1`
  - Health: `/health`
  - Requires model at `ML/models/Plant_species.h5`
  - See `ML/DEPLOY_RENDER.md` for details

## Troubleshooting

- 401 Not authorized: Ensure `JWT_SECRET` and client Authorization header. Login returns `token` stored in localStorage.
- CORS errors: Server CORS is set to `origin: true`; ensure your frontend origin matches and requests include credentials when required.
- Mongo connection: Verify `MONGO_URI` and network access/whitelisting.
- Cloudinary: Set cloud name, key, secret; check that `uploads/` is writable locally.
- ML calls fail: Ensure FastAPI service is running at port 8000 with the required endpoints and payload format.
- Gemini/OpenCage errors: Validate API keys and quotas.

## Scripts

- Server: `npm start` (nodemon `index.js`)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## License

Add your preferred license (e.g., MIT).
