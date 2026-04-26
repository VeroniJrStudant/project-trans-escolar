import Link from "next/link";
import { vehicleKindLabel } from "@/lib/types";
import { formatKm, formatDate } from "@/lib/format";
import { listVehicles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const vehicles = await listVehicles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Veículos</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Controle individual por unidade: motorista responsável, rota associada,
          quilometragem e próximos vencimentos.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/veiculos/novo"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Cadastrar veículo
        </Link>
        <Link
          href="/lancamentos"
          className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-elevated-2"
        >
          Central de lançamentos
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vehicles.map((v) => (
          <Link
            key={v.id}
            href={`/veiculos/${v.id}`}
            className="group rounded-xl border border-line bg-elevated p-5 shadow-sm transition hover:border-emerald-300/80 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-ink">{v.plate}</p>
                <p className="text-sm text-muted">{v.label}</p>
              </div>
              <span className="rounded-full bg-elevated-2 px-2.5 py-0.5 text-xs font-medium text-muted ring-1 ring-line/60 group-hover:bg-emerald-50 group-hover:text-emerald-900 group-hover:ring-emerald-200">
                {vehicleKindLabel[v.kind]}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted">
              <div>
                <dt className="text-subtle">Odômetro</dt>
                <dd className="font-medium text-ink">
                  {formatKm(v.odometerKm)}
                </dd>
              </div>
              <div>
                <dt className="text-subtle">Capacidade</dt>
                <dd className="font-medium text-ink">
                  {v.capacity} lugares
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-subtle">Próxima inspeção / doc.</dt>
                <dd className="font-medium text-ink">
                  {formatDate(v.nextInspectionDate)}
                </dd>
              </div>
              {v.driverName ? (
                <div className="col-span-2">
                  <dt className="text-subtle">Motorista</dt>
                  <dd className="font-medium text-ink">{v.driverName}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-3 text-xs font-medium text-emerald-700 group-hover:underline">
              Abrir ficha do veículo →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
