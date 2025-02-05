import { Polyline } from "react-leaflet";

export default function TransitLines({ lines }) {
  return (
    <>
      {lines.map((line, index) => (
        <Polyline key={index} positions={line.positions} color={line.color} weight={5} />
      ))}
    </>
  );
}
