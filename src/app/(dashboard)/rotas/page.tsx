import { TripCreateForm } from "@/components/forms/trip-create-form";
import { GpsRecentTable } from "@/components/rotas/gps-recent-table";
import { RouteMonitor } from "@/components/rotas/route-monitor";
import {
  listRecentGps,
  listTripsWithWaypoints,
  listVehicles,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const [trips, vehicles, gpsPoints] = await Promise.all([
    listTripsWithWaypoints(),
    listVehicles(),
    listRecentGps(40),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Rotas percorridas
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Acompanhamento do trajeto realizado na ida ou volta dos alunos. O mapa
          usa tiles OpenStreetMap e polyline a partir dos pontos da viagem
          selecionada no banco.
        </p>
      </div>

      {vehicles.length ? <TripCreateForm vehicles={vehicles} /> : null}

      {trips.length ? (
        <RouteMonitor trips={trips} vehicles={vehicles} />
      ) : (
        <p className="text-sm text-muted">
          Nenhuma viagem cadastrada. Use o formulário acima ou o seed do banco.
        </p>
      )}

      <GpsRecentTable points={gpsPoints} />

      <section className="rounded-xl border border-line bg-panel p-5 text-sm text-muted">
        <h2 className="text-sm font-semibold text-emerald-300">
          API de telemetria (GPS)
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-subtle">
          <code className="text-ink">POST /api/telemetry/ingest</code> com header{" "}
          <code className="text-ink">x-api-key</code> igual a{" "}
          <code className="text-ink">GPS_INGEST_API_KEY</code> no servidor.
          Corpo JSON:{" "}
          <code className="mt-2 block overflow-x-auto rounded bg-elevated p-2 font-mono text-[11px] text-ink">
            {`{ "vehicleId": "<id>", "points": [`}
            <br />
            {`  { "lat": -23.55, "lng": -46.63, "recordedAt": "2026-04-22T12:00:00.000Z", "source": "rastreador" }`}
            <br />
            {`] }`}
          </code>
        </p>
      </section>
    </div>
  );
}
