import { CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";

export default function StationMarker({ station }) {
  return (
    <CircleMarker
      center={[station.lat, station.lng]}
      radius={20}
      color="#000000"
      fillOpacity={0.9}
      weight={2}
      pathOptions={{
        fillColor: station.color
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} permanent>
        {station.name} ({station.routeName})
      </Tooltip>
    </CircleMarker>
  );
}
