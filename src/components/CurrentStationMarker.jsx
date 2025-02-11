import { CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";

export default function StationMarker({ station, showDetails }) {
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
      <Tooltip className="station-tooltip" direction="top" offset={[0, -10]} permanent>
        <strong>{station.name}</strong> ({station.routeName})
        {showDetails && (
          <div>
            <div class="station-address">{station.address}</div>
            <div class="station-lines">Lines: {station.lines.join(', ')}</div>
            <div class="station-accessible">Wheelchair Accessible: {station.wheelchair}</div>
          </div>
        )}
      </Tooltip>
    </CircleMarker>
  );
}
