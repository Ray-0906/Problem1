# Deploy Plant Species FastAPI on Render

This service runs the FastAPI model API in `ML/api1forplant_species.py`.

## Service settings
- Root: repository root
- Build command:
  - `pip install -r ML/requirements.txt`
- Start command:
  - `uvicorn ML.api1forplant_species:app --host 0.0.0.0 --port $PORT --workers 1`
- Health check path: `/health`
- Environment: Python 3.11

## Files/paths
- Model file expected at: `ML/models/Plant_species.h5`
- App entry: `ML/api1forplant_species.py` (module path `ML.api1forplant_species:app`)
- Requirements: `ML/requirements.txt`

## CORS
CORS is open to `*` in the app. Restrict origins for production.

## Common issues
- 404: Verify health path `/health` and start command module path.
- Model not found: Ensure `ML/models/Plant_species.h5` is committed or provided via Render Disk.
- TensorFlow build errors: ensure Python version matches (3.11) and plan has sufficient RAM (Starter+ recommended).

## Optional env vars
- `TF_CPP_MIN_LOG_LEVEL=2` to quiet TF logs
- `WEB_CONCURRENCY=1` (keep 1 worker unless using multiple CPUs)
