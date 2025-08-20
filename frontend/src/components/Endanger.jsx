import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../utils/axios';

const EndangeredSpeciesMap = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // Default: India
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    // Hardcoded endangered species data
    // const hardcodedSpeciesData = [
    //   {
    //     name: "Red Panda",
    //     status: "endangered",
    //     coordinates: [88.6050, 27.0569]
    //   },
    //   {
    //     name: "Snow Leopard",
    //     status: "endangered",
    //     coordinates: [77.3756, 32.2432]
    //   },
    //   {
    //     name: "Great Indian Bustard",
    //     status: "endangered",
    //     coordinates: [72.6371, 26.9124]
    //   },
    //   {
    //     name: "Bengal Tiger",
    //     status: "endangered",
    //     coordinates: [88.7264, 21.9497]
    //   },
    //   {
    //     name: "Lion-tailed Macaque",
    //     status: "endangered",
    //     coordinates: [76.6026, 10.2211]
    //   },
    //   {
    //     name: "Nilgiri Tahr",
    //     status: "endangered",
    //     coordinates: [77.0620, 8.7336]
    //   },
    //   {
    //     name: "Hoolock Gibbon",
    //     status: "endangered",
    //     coordinates: [93.9500, 27.0000]
    //   }
    // ];

    // setSpeciesData(hardcodedSpeciesData);

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationLoaded(true);
      },
      () => {
        console.warn("Geolocation not available or permission denied.");
        setLocationLoaded(true);
      }
    );

    const fetchData = async () => {
      try {
  // Use secured API mounted under /api/observations
  const response = await axiosInstance.get('/api/observations/endangered');
        setSpeciesData(response.data);
      } catch (error) {
        console.error("Error fetching endangered species:", error);
      }
    };

    fetchData();
  }, []);

  const isEcologistDash = typeof window !== 'undefined' && window.location?.pathname?.toLowerCase() === '/edash';

  return (
    locationLoaded && (
      <div className="space-y-4">
        <div className="relative z-0 overflow-hidden rounded-lg shadow">
      <MapContainer center={userLocation} zoom={9} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <CircleMarker
          center={userLocation}
          radius={8}
          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.7 }}
        >
          <Popup>Your location</Popup>
        </CircleMarker>

        {speciesData.map((species, index) => (
          <CircleMarker
            key={index}
            center={[species.coordinates[1], species.coordinates[0]]}
            radius={6}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{species.name}</strong><br />
              Status: {species.status}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>  
  </div>

  {isEcologistDash && (
    <div className="bg-white border rounded-lg shadow p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Endangered Species (observations)</h3>
        <span className="text-xs text-gray-500">Total: {speciesData.length}</span>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="px-3 py-2 font-medium text-gray-600">#</th>
            <th className="px-3 py-2 font-medium text-gray-600">Species</th>
            <th className="px-3 py-2 font-medium text-gray-600">Status</th>
            <th className="px-3 py-2 font-medium text-gray-600">Latitude</th>
            <th className="px-3 py-2 font-medium text-gray-600">Longitude</th>
          </tr>
        </thead>
        <tbody>
          {speciesData.map((s, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-3 py-2 text-gray-700">{idx + 1}</td>
              <td className="px-3 py-2 text-gray-800 font-medium">{s.name || 'Unknown'}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'endangered' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {s.status}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-700">{Array.isArray(s.coordinates) ? Number(s.coordinates[1]).toFixed(5) : '—'}</td>
              <td className="px-3 py-2 text-gray-700">{Array.isArray(s.coordinates) ? Number(s.coordinates[0]).toFixed(5) : '—'}</td>
            </tr>
          ))}
          {speciesData.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-gray-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
  </div>));
};

export default EndangeredSpeciesMap;
