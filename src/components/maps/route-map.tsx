"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Polyline, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

export type LatLngTuple = [number, number];

export function RouteMap({
  positions,
  className,
}: {
  positions: LatLngTuple[];
  className?: string;
}) {
  if (positions.length === 0) {
    return (
      <div
        className={
          className ??
          "flex h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500"
        }
      >
        Sem pontos GPS para exibir.
      </div>
    );
  }

  const bounds = L.latLngBounds(positions);
  const center = bounds.getCenter();

  return (
    <div
      className={
        className ??
        "h-[420px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm"
      }
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={positions}
          pathOptions={{ color: "#059669", weight: 5, opacity: 0.85 }}
        />
        <CircleMarker
          center={positions[0]}
          radius={8}
          pathOptions={{
            color: "#15803d",
            fillColor: "#22c55e",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Tooltip>Início</Tooltip>
        </CircleMarker>
        {positions.length > 1 ? (
          <CircleMarker
            center={positions[positions.length - 1]}
            radius={8}
            pathOptions={{
              color: "#0369a1",
              fillColor: "#0ea5e9",
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip>Fim</Tooltip>
          </CircleMarker>
        ) : null}
      </MapContainer>
    </div>
  );
}
