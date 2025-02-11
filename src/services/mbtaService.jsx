import axios from "axios";
import { CircleMarker } from "react-leaflet";

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

export const fetchStations = async () => {
  let allStations = [];
  let allLines = [];
  let stationLineMap = new Map(); // Tracks station IDs and their corresponding lines

  for (const line of Object.keys(lineColors)) {
    try {
      const response = await axios.get(
        `https://api-v3.mbta.com/stops?filter[route]=${line}&include=route`
      );
      const lineStations = response.data.data
        .map((station) => {
          if (!stationLineMap.has(station.id)) {
            stationLineMap.set(station.id, new Set());
          }
          stationLineMap.get(station.id).add(line);
          
          return {
            id: station.id,
            name: station.attributes.name,
            lat: station.attributes.latitude,
            lng: station.attributes.longitude,
            address: station.attributes.address || "No address found",
            wheelchair: station.attributes.wheelchair_boarding === 1 ? "Yes" : "No",
            routeName: response.data.included?.find((r) => r.id === line)?.attributes?.long_name || line,
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
    } catch (error) {
      console.error(`Error fetching MBTA data for ${line}:`, error);
    }
  }

  // Update each station's lines attribute with the full set of lines it belongs to
  allStations = allStations.map((station) => ({
    ...station,
    lines: Array.from(stationLineMap.get(station.id) || []),
  }));

  return { stations: allStations, lines: allLines };
};