import { Marker } from "react-leaflet";
import L from "leaflet";

const stationIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/MBTA.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

export default function StationMarker({ station, onClick }) {
  return (
    <Marker
      position={[station.lat, station.lng]}
      icon={stationIcon}
      eventHandlers={{
        click: () => onClick(station),
      }}
    />
  );
}
