import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getVehicleById,
  listFuelForVehicle,
  listPartsForVehicle,
  listServicesForVehicle,
  listTripsForVehicle,
} from "@/lib/queries";
import { vehicleKindLabel } from "@/lib/types";
import { formatBrl, formatDate, formatDateTime, formatKm } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const v = await getVehicleById(params.id);
  if (!v) notFound();

  const [vTrips, vParts, vFuel, vServices] = await Promise.all([
    listTripsForVehicle(v.id),
    listPartsForVehicle(v.id),
    listFuelForVehicle(v.id),
    listServicesForVehicle(v.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/veiculos"
            className="text-xs font-medium text-emerald-700 hover:underline"
          >
            ← Voltar para veículos
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {v.plate}{" "}
            <span className="text-base font-normal text-slate-500">
              {v.label}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {vehicleKindLabel[v.kind]} · {v.capacity} lugares ·{" "}
            {formatKm(v.odometerKm)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/rotas"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Ver rotas no mapa
          </Link>
          <Link
            href="/manutencao"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Lançar manutenção
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">Operação</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="font-medium text-slate-900">
                {v.status === "ativo"
                  ? "Ativo em rota"
                  : v.status === "manutencao"
                    ? "Em manutenção"
                    : "Inativo"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Motorista</dt>
              <dd className="font-medium text-slate-900">
                {v.driverName ?? "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500">Rota escolar</dt>
              <dd className="font-medium text-slate-900">
                {v.schoolRouteName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Próxima inspeção / doc.</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(v.nextInspectionDate)}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-slate-100 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-300">Resumo rápido</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li>
              Viagens com trajeto:{" "}
              <span className="font-semibold text-white">{vTrips.length}</span>
            </li>
            <li>
              Lançamentos de peças:{" "}
              <span className="font-semibold text-white">{vParts.length}</span>
            </li>
            <li>
              Abastecimentos:{" "}
              <span className="font-semibold text-white">{vFuel.length}</span>
            </li>
            <li>
              Serviços gerais:{" "}
              <span className="font-semibold text-white">{vServices.length}</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Viagens recentes (trajeto registrado)
          </h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {vTrips.length ? (
            vTrips.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{t.routeName}</p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(t.startedAt)} → {formatDateTime(t.endedAt)}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p>{t.distanceKm} km</p>
                  <p>{t.stops} paradas</p>
                </div>
              </li>
            ))
          ) : (
            <li className="px-5 py-6 text-sm text-slate-500">
              Nenhuma viagem registrada para este veículo.
            </li>
          )}
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <MiniTable
          title="Peças"
          rows={vParts.map((p) => ({
            k: p.id,
            a: p.partName,
            b: formatDate(p.date),
            c: formatBrl(p.costBrl),
          }))}
        />
        <MiniTable
          title="Combustível"
          rows={vFuel.map((f) => ({
            k: f.id,
            a: `${f.liters} L`,
            b: formatDate(f.date),
            c: formatBrl(f.costBrl),
          }))}
        />
        <MiniTable
          title="Serviços"
          rows={vServices.map((s) => ({
            k: s.id,
            a: s.title,
            b: formatDate(s.date),
            c: formatBrl(s.costBrl),
          }))}
        />
      </div>
    </div>
  );
}

function MiniTable({
  title,
  rows,
}: {
  title: string;
  rows: { k: string; a: string; b: string; c: string }[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h3>
      </div>
      <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto text-sm">
        {rows.length ? (
          rows.map((r) => (
            <li key={r.k} className="px-4 py-2.5">
              <p className="font-medium text-slate-900 line-clamp-2">{r.a}</p>
              <p className="mt-0.5 flex justify-between text-xs text-slate-500">
                <span>{r.b}</span>
                <span className="font-medium text-slate-700">{r.c}</span>
              </p>
            </li>
          ))
        ) : (
          <li className="px-4 py-4 text-xs text-slate-500">Sem lançamentos.</li>
        )}
      </ul>
    </section>
  );
}
