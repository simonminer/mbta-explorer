import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapMover from "./components/MapMover";
import StationMarker from "./components/StationMarker";
import CurrentStationMarker from "./components/CurrentStationMarker";
import TransitLines from "./components/TransitLines";
import { fetchStations } from "./services/mbtaService";

export default function MBTAMap() {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentCircleMarker, setCurrentCircleMarker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { stations, lines } = await fetchStations();
      setStations(stations);
      setLines(lines);
    };
    getData();
  }, []);  
 
  const handleKeyDown = (e) => {
    if (stations.length === 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % stations.length);
      setShowDetails(false);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + stations.length) % stations.length);
      setShowDetails(false);
    } else if (e.key === "Enter") {
      setShowDetails((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stations]);

  return (
    <div>
      <h2>MBTA Explorer</h2>
      <p>Use arrow keys to navigate stations or click on a station icon to select it. Press Enter to see station details.</p>
      {stations[selectedIndex] && (
        <p>
          <strong>Current Station:</strong> {stations[selectedIndex].name} ({stations[selectedIndex].routeName} Line)
        </p>
      )}

      <MapContainer center={[42.3601, -71.0589]} zoom={13} style={{ height: "500px", width: "90vw" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {stations[selectedIndex] && (
          <MapMover
            position={[stations[selectedIndex].lat, stations[selectedIndex].lng]}
          />
        )}

        <TransitLines lines={lines} />

        {stations.map((station, index) => (
         <StationMarker 
            key={station.id} 
            station={station} 
            onClick={() => setSelectedIndex(index)} 
          />
        ))}
      
        {stations[selectedIndex] && (
          <CurrentStationMarker
            station={stations[selectedIndex]}
            showDetails={showDetails}
          />            
        )}
      </MapContainer>
    </div>
  );
}
