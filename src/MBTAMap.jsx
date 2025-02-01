import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample MBTA station data (use MBTA API for live data)
const stations = [
  { id: "park", name: "Park Street", lat: 42.3564, lng: -71.0624 },
  { id: "gov", name: "Government Center", lat: 42.3597, lng: -71.0592 },
  { id: "state", name: "State Street", lat: 42.3587, lng: -71.0570 },
];

export default function MBTAMap() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % stations.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + stations.length) % stations.length);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <h2>MBTA Subway Map</h2>
      <p>Use arrow keys to navigate stations.</p>
      <p><strong>Current Station:</strong> {stations[selectedIndex].name}</p>

      <MapContainer center={[42.3564, -71.0624]} zoom={14} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station, index) => (
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>{station.name} {index === selectedIndex && "(Selected)"}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

