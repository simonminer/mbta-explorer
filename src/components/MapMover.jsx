import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapMover({ position, onMoveEnd }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 0.25 });
      map.once("moveend", onMoveEnd);
    }
  }, [position, map, onMoveEnd]);

  return null;
}