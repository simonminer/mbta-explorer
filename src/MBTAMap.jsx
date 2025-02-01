import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Custom MBTA marker icon
const mbtaIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/MBTA.svg/1024px-MBTA.svg.png",
  iconSize: [20, 20],
});

// MBTA API URL (fetch all subway stations)
const MBTA_API_URL =
  "https://api-v3.mbta.com/stops?filter[route]=Red,Blue,Orange,Green-B,Green-C,Green-D,Green-E&include=route";

export default function MBTAMap() {
  const [stations, setStations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch station data from MBTA API
  useEffect(() => {
    axios
      .get(MBTA_API_URL)
      .then((response) => {
        const fetchedStations = response.data.data.map((station) => ({
          id: station.id,
          name: station.attributes.name,
          lat: station.attributes.latitude,
          lng: station.attributes.longitude,
        }));

        setStations(fetchedStations);
      })
      .catch((error) => console.error("Error fetching MBTA data:", error));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (stations.length === 0) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % stations.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + stations.length) % stations.length);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stations]);

  return (
    <div>
      <h2>MBTA Subway Map</h2>
      <p>Use arrow keys to navigate stations.</p>
      {stations.length > 0 && (
        <p>
          <strong>Current Station:</strong> {stations[selectedIndex]?.name}
        </p>
      )}

      <MapContainer center={[42.3601, -71.0589]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {stations.map((station, index) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={mbtaIcon}
          >
            <Popup>
              {station.name} {index === selectedIndex && "(Selected)"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
