import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

    // You can later enable this when using real API
    const fetchData = async () => {
      try {
       
        const response = await axiosInstance.get('/endangered',{headers:{Authorization:`Bearer ${localStorage.getItem("user")}`}});
        // console.log(response.data);
        setSpeciesData(response.data);
      } catch (error) {
        console.error("Error fetching endangered species:", error);
      }
    };

    fetchData();
  }, []);

  return (
    locationLoaded && (
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
    )
  );
};

export default EndangeredSpeciesMap;
