import { CircleMarker } from "react-leaflet";

export default function StationCircleMarker({ station, isVisible }) {
  if (!isVisible || !station) return null;

  return (
    <CircleMarker
      center={[station.lat, station.lng]}
      radius={20}
      color="#000000"
      fillColor={station.color}
      fillOpacity={0.9}
      weight={2}
    />
  );
}
