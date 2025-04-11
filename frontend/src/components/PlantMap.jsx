import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function PlantMap() {
    const plantSightings = [
        {
          species: "Neem (Azadirachta indica)",
          lat: 22.805,
          lng: 86.202,
          notes: "Identified near Dalma Wildlife Sanctuary",
          imageUrl: "https://example.com/neem.jpg"
        },
        {
          species: "Arjun (Terminalia arjuna)",
          lat: 22.799,
          lng: 86.210,
          notes: "Located beside riverbank",
          imageUrl: "https://example.com/arjun.jpg"
        }
      ];
      
  return (
    <MapContainer center={[22.8, 86.2]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {plantSightings.map((plant, index) => (
        <Marker key={index} position={[plant.lat, plant.lng]}>
          <Popup>
            <strong>{plant.species}</strong><br />
            {plant.notes}<br />
            <img src={plant.imageUrl} alt={plant.species} className="w-32 h-20 object-cover mt-2" />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
