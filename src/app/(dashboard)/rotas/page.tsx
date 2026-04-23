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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Rotas percorridas
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Acompanhamento do trajeto realizado na ida ou volta dos alunos. O mapa
          usa tiles OpenStreetMap e polyline a partir dos pontos da viagem
          selecionada no banco.
        </p>
      </div>

      {vehicles.length ? <TripCreateForm vehicles={vehicles} /> : null}

      {trips.length ? (
        <RouteMonitor trips={trips} vehicles={vehicles} />
      ) : (
        <p className="text-sm text-slate-600">
          Nenhuma viagem cadastrada. Use o formulário acima ou o seed do banco.
        </p>
      )}

      <GpsRecentTable points={gpsPoints} />

      <section className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-sm text-slate-300">
        <h2 className="text-sm font-semibold text-emerald-300">
          API de telemetria (GPS)
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          <code className="text-slate-200">POST /api/telemetry/ingest</code> com
          header <code className="text-slate-200">x-api-key</code> igual a{" "}
          <code className="text-slate-200">GPS_INGEST_API_KEY</code> no servidor.
          Corpo JSON:{" "}
          <code className="block mt-2 overflow-x-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-slate-200">
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
