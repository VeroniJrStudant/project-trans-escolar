"use client";

import { useMemo, useState } from "react";
import { RouteMapDynamic } from "@/components/maps/route-map-dynamic";
import type { LatLngTuple } from "@/components/maps/route-map";
import { formatDateTime } from "@/lib/format";
import type { RouteTrip, Vehicle } from "@/lib/types";

export function RouteMonitor({
  trips,
  vehicles,
}: {
  trips: RouteTrip[];
  vehicles: Vehicle[];
}) {
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");

  const trip = useMemo(
    () => trips.find((t) => t.id === tripId) ?? trips[0],
    [tripId, trips],
  );

  const vehicle = trip
    ? vehicles.find((v) => v.id === trip.vehicleId)
    : undefined;

  const positions: LatLngTuple[] = useMemo(
    () => (trip ? trip.path.map((p) => [p.lat, p.lng] as LatLngTuple) : []),
    [trip],
  );

  if (!trip) {
    return (
      <p className="text-sm text-muted">Nenhuma viagem registrada.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-2">
          <label
            htmlFor="trip"
            className="text-xs font-medium uppercase tracking-wide text-subtle"
          >
            Viagem registrada
          </label>
          <select
            id="trip"
            value={trip.id}
            onChange={(e) => setTripId(e.target.value)}
            className="w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {trips.map((t) => {
              const v = vehicles.find((x) => x.id === t.vehicleId);
              return (
                <option key={t.id} value={t.id}>
                  {v?.plate} — {t.routeName} ({formatDateTime(t.startedAt)})
                </option>
              );
            })}
          </select>
        </div>
        <dl className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-elevated px-4 py-3 text-sm sm:grid-cols-4 lg:gap-6 lg:px-5">
          <div>
            <dt className="text-xs text-subtle">Veículo</dt>
            <dd className="font-semibold text-ink">
              {vehicle?.plate ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Distância</dt>
            <dd className="font-semibold text-ink">{trip.distanceKm} km</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Paradas</dt>
            <dd className="font-semibold text-ink">{trip.stops}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs text-subtle">Janela</dt>
            <dd className="text-xs font-medium leading-snug text-ink">
              {formatDateTime(trip.startedAt)} → {formatDateTime(trip.endedAt)}
            </dd>
          </div>
        </dl>
      </div>

      <RouteMapDynamic positions={positions} />

      <p className="text-xs text-subtle">
        Em produção, alimente o mapa com pontos GPS reais (telemetria ou app do
        motorista). Esta tela já separa monitoramento de rota do cadastro de
        manutenção.
      </p>
    </div>
  );
}
