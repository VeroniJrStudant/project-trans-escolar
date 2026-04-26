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
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {v.plate}{" "}
            <span className="text-base font-normal text-subtle">{v.label}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
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
            className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-3 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-elevated-2"
          >
            Lançar manutenção
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-elevated p-4 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Operação</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-subtle">Status</dt>
              <dd className="font-medium text-ink">
                {v.status === "ativo"
                  ? "Ativo em rota"
                  : v.status === "manutencao"
                    ? "Em manutenção"
                    : "Inativo"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-subtle">Motorista</dt>
              <dd className="font-medium text-ink">
                {v.driverName ?? "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-subtle">Rota escolar</dt>
              <dd className="font-medium text-ink">
                {v.schoolRouteName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-subtle">Próxima inspeção / doc.</dt>
              <dd className="font-medium text-ink">
                {formatDate(v.nextInspectionDate)}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-line bg-panel p-4 text-ink shadow-sm">
          <h2 className="text-sm font-semibold text-accent">Resumo rápido</h2>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            <li>
              Viagens com trajeto:{" "}
              <span className="font-semibold text-ink">{vTrips.length}</span>
            </li>
            <li>
              Lançamentos de peças:{" "}
              <span className="font-semibold text-ink">{vParts.length}</span>
            </li>
            <li>
              Abastecimentos:{" "}
              <span className="font-semibold text-ink">{vFuel.length}</span>
            </li>
            <li>
              Serviços gerais:{" "}
              <span className="font-semibold text-ink">{vServices.length}</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="rounded-xl border border-line bg-elevated shadow-sm">
        <div className="border-b border-line-soft px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">
            Viagens recentes (trajeto registrado)
          </h2>
        </div>
        <ul className="divide-y divide-line-soft">
          {vTrips.length ? (
            vTrips.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{t.routeName}</p>
                  <p className="text-xs text-subtle">
                    {formatDateTime(t.startedAt)} → {formatDateTime(t.endedAt)}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p>{t.distanceKm} km</p>
                  <p>{t.stops} paradas</p>
                </div>
              </li>
            ))
          ) : (
            <li className="px-5 py-6 text-sm text-subtle">
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
    <section className="rounded-xl border border-line bg-elevated shadow-sm">
      <div className="border-b border-line-soft px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle">
          {title}
        </h3>
      </div>
      <ul className="max-h-56 divide-y divide-line-soft overflow-y-auto text-sm">
        {rows.length ? (
          rows.map((r) => (
            <li key={r.k} className="px-4 py-2.5">
              <p className="line-clamp-2 font-medium text-ink">{r.a}</p>
              <p className="mt-0.5 flex justify-between text-xs text-subtle">
                <span>{r.b}</span>
                <span className="font-medium text-muted">{r.c}</span>
              </p>
            </li>
          ))
        ) : (
          <li className="px-4 py-4 text-xs text-subtle">Sem lançamentos.</li>
        )}
      </ul>
    </section>
  );
}
