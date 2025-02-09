import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapMover from "./components/MapMover";
import StationMarker from "./components/StationMarker";
import TransitLines from "./components/TransitLines";
import { fetchStations } from "./services/mbtaService";

export default function MBTAMap() {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [circleMarkers, setCircleMarkers] = useState({});
  const [currentCircleMarker, setCurrentCircleMarker] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const { stations, lines, markers } = await fetchStations();
      setStations(stations);
      setLines(lines);
      setCircleMarkers(markers);
    };
    getData();
  }, []);  

  const updateCircleMarker = () => {
    if (stations[selectedIndex]) {
      const newMarker = circleMarkers[stations[selectedIndex].line]?.(stations[selectedIndex]);
      // Serialize markers so they can be compared as strings instead of as shallow objects.
      if (JSON.stringify(newMarker) !== JSON.stringify(currentCircleMarker)) {  
        setCurrentCircleMarker(circleMarkers[stations[selectedIndex].line]?.(stations[selectedIndex]));
      }
    }
  };
 
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
      <p>Use arrow keys to navigate stations or click on a station icon to select it.</p>
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
            onMoveEnd={updateCircleMarker}
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
      
        {currentCircleMarker}

      </MapContainer>
    </div>
  );
}
