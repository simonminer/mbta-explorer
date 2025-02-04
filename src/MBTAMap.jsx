import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

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

const getStationIcon = (color) =>
  new L.Icon({
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/MBTA.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10],
  });

function MapMover({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }
  }, [position, map]);
  return null;
}

export default function MBTAMap() {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState("gray");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        let allStations = [];
        let allLines = [];
        for (const line of LINES) {
          const response = await axios.get(
            `https://api-v3.mbta.com/stops?filter[route]=${line}&include=route`
          );
          const lineStations = response.data.data
            .map((station) => {
              const routeName = response.data.included?.find((r) => r.id === line)?.attributes?.long_name || line;
              return {
                id: station.id,
                name: station.attributes.name,
                lat: station.attributes.latitude,
                lng: station.attributes.longitude,
                line,
                routeName,
                color: lineColors[line] || "gray",
              };
            })
            .filter((station) => station.lat !== null && station.lng !== null);
          allStations = [...allStations, ...lineStations];
          for (let i = 0; i < lineStations.length - 1; i++) {
            allLines.push({
              positions: [
                [lineStations[i].lat, lineStations[i].lng],
                [lineStations[i + 1].lat, lineStations[i + 1].lng],
              ],
              color: lineColors[line] || "gray",
            });
          }
        }
        setStations(allStations);
        setLines(allLines);
      } catch (error) {
        console.error("Error fetching MBTA data:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (stations.length > 0 && stations[selectedIndex]) {
      setCurrentColor(stations[selectedIndex].color);
    }
  }, [selectedIndex, stations]);

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
          <MapMover position={[stations[selectedIndex].lat, stations[selectedIndex].lng]} />
        )}

        {lines.map((line, index) => (
          <Polyline key={index} positions={line.positions} color={line.color} weight={5} />
        ))}

        {stations.map((station, index) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={getStationIcon(station.color)}
            eventHandlers={{
              click: () => setSelectedIndex(index),
            }}
          />
        ))}

        {stations[selectedIndex] && (
          <CircleMarker
            center={[stations[selectedIndex].lat, stations[selectedIndex].lng]}
            radius={20}
            color={currentColor}
            fillColor={currentColor}
            fillOpacity={0.7}
            weight={4}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent>
              {stations[selectedIndex].name} ({stations[selectedIndex].routeName} Line)
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
