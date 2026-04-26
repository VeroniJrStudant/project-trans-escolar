import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatBrl, formatDate } from "@/lib/format";
import {
  listFuelLogs,
  listPartMaintenances,
  listServiceMaintenances,
  listTripsWithWaypoints,
  listVehicles,
} from "@/lib/queries";

export default async function HomePage() {
  const [vehicles, trips, fuelLogs, parts, services] = await Promise.all([
    listVehicles(),
    listTripsWithWaypoints(),
    listFuelLogs(),
    listPartMaintenances(),
    listServiceMaintenances(),
  ]);

  const active = vehicles.filter((v) => v.status === "ativo").length;
  const inMaint = vehicles.filter((v) => v.status === "manutencao").length;
  const lastFuel = fuelLogs[0];
  const nextInspectionSoon = vehicles
    .filter((v) => new Date(v.nextInspectionDate) <= new Date("2026-05-01"))
    .sort(
      (a, b) =>
        new Date(a.nextInspectionDate).getTime() -
        new Date(b.nextInspectionDate).getTime(),
    );

  const maintSpend =
    [...parts, ...services].reduce((acc, r) => acc + r.costBrl, 0) +
    fuelLogs.reduce((acc, r) => acc + r.costBrl, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Visão geral
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Painel para frota pequena de transporte escolar: rotas percorridas,
          abastecimento, peças e revisões por veículo (dados no PostgreSQL).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Veículos ativos"
          value={`${active} / ${vehicles.length}`}
          hint={inMaint ? `${inMaint} em manutenção` : "Frota em operação"}
        />
        <StatCard
          title="Viagens com trajeto"
          value={String(trips.length)}
          hint="Deslocamentos registrados"
        />
        <StatCard
          title="Último abastecimento"
          value={lastFuel ? formatBrl(lastFuel.costBrl) : "—"}
          hint={
            lastFuel
              ? `${lastFuel.liters} L · ${formatDate(lastFuel.date)}`
              : undefined
          }
        />
        <StatCard
          title="Gastos (peças + serviços + combustível)"
          value={formatBrl(maintSpend)}
          hint="Somatório dos lançamentos atuais no banco"
        />
      </div>

      {nextInspectionSoon.length ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium">Vencimentos próximos</p>
            <ul className="mt-2 space-y-1 text-amber-900/90">
              {nextInspectionSoon.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/veiculos/${v.id}`}
                    className="font-medium underline decoration-amber-400/60 underline-offset-2 hover:decoration-amber-700"
                  >
                    {v.plate}
                  </Link>{" "}
                  — inspeção / documentação em{" "}
                  <span className="whitespace-nowrap">
                    {formatDate(v.nextInspectionDate)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">Acesso rápido</h2>
          </div>
          <ul className="mt-4 divide-y divide-line-soft">
            {[
              {
                href: "/lancamentos",
                title: "Central de lançamentos",
                desc: "Veículo, viagem, manutenção e API de GPS",
              },
              {
                href: "/rotas",
                title: "Monitorar rota percorrida",
                desc: "Mapa com polyline e resumo da viagem",
              },
              {
                href: "/manutencao",
                title: "Manutenção por peças, combustível e serviços",
                desc: "Histórico e novos registros",
              },
              {
                href: "/frota",
                title: "Visão da frota por tipo",
                desc: "Ônibus, microônibus, vans e utilitários",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-ink group-hover:text-emerald-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-subtle">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-subtle/60 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">Últimas viagens</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {trips.slice(0, 6).map((t) => {
              const v = vehicles.find((x) => x.id === t.vehicleId);
              return (
                <li
                  key={t.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-elevated-2 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-ink">{t.routeName}</p>
                    <p className="text-xs text-subtle">
                      {v?.plate} · {t.distanceKm} km · {t.stops} paradas
                    </p>
                  </div>
                  <Link
                    href="/rotas"
                    className="text-xs font-medium text-emerald-700 hover:underline"
                  >
                    Ver no mapa
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
