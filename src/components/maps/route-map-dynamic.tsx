"use client";

import dynamic from "next/dynamic";
import type { LatLngTuple } from "./route-map";

const RouteMap = dynamic(
  () => import("./route-map").then((m) => m.RouteMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

function MapSkeleton() {
  return (
    <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-elevated text-sm text-subtle">
      Carregando mapa…
    </div>
  );
}

export function RouteMapDynamic(props: {
  positions: LatLngTuple[];
  className?: string;
}) {
  return <RouteMap {...props} />;
}
