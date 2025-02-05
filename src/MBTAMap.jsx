import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapMover from "./components/MapMover";
import StationMarker from "./components/StationMarker";
import { fetchStations } from "./services/mbtaService";

// MBTA line colors
const lineColors = {
  Red: "#FF0000",
  Blue: "#0000FF",
  Orange: "#FFA500",
  "Green-B": "#008000",
  "Green-C": "#008000",
  "Green-D": "#008000",
  "Green-E": "#008000",
};

const LINES = ["Red", "Blue", "Orange", "Green-B", "Green-C", "Green-D", "Green-E"];

const getStationIcon = () =>
  new L.Icon({
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/MBTA.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10],
  });

export default function MBTAMap() {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [circleMarkers, setCircleMarkers] = useState({});
  const [currentCircleMarker, setCurrentCircleMarker] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const { stations, lines, markers } = await fetchStations(lineColors);
      setStations(stations);
      setLines(lines);
      setCircleMarkers(markers);
    };
    getData();
  }, []);  

  const updateCircleMarker = () => {
    if (stations[selectedIndex]) {
      setCurrentCircleMarker(circleMarkers[stations[selectedIndex].line]?.(stations[selectedIndex]));
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

        {lines.map((line, index) => (
          <Polyline key={index} positions={line.positions} color={line.color} weight={5} />
        ))}

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
