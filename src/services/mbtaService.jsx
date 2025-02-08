import axios from "axios";

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
  let markers = {};

  for (const line of Object.keys(lineColors)) {
    try {
      const response = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${line}&include=route`);
      const lineStations = response.data.data
        .map((station) => ({
          id: station.id,
          name: station.attributes.name,
          lat: station.attributes.latitude,
          lng: station.attributes.longitude,
          line,
          routeName: response.data.included?.find((r) => r.id === line)?.attributes?.long_name || line,
          color: lineColors[line] || "gray",
        }))
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

      markers[line] = (station) => (
        <CircleMarker
          key={station.id}
          center={[station.lat, station.lng]}
          radius={20}
          color="#000000"
          fillColor={lineColors[station.line] || "gray"}
          fillOpacity={0.9}
          weight={2}
        />
      );
    } catch (error) {
      console.error(`Error fetching MBTA data for ${line}:`, error);
    }
  }

  return { stations: allStations, lines: allLines, markers };
};
