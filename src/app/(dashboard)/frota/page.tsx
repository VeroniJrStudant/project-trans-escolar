import Link from "next/link";
import { vehicleKindLabel } from "@/lib/types";
import type { VehicleKind } from "@/lib/types";
import { formatKm } from "@/lib/format";
import { listVehicles } from "@/lib/queries";
import type { Vehicle } from "@/lib/types";

export const dynamic = "force-dynamic";

function countByKind(list: Vehicle[]): Record<VehicleKind, number> {
  return list.reduce(
    (acc, v) => {
      acc[v.kind] += 1;
      return acc;
    },
    { onibus: 0, microonibus: 0, van: 0, utilitario: 0 } as Record<
      VehicleKind,
      number
    >,
  );
}

export default async function FleetPage() {
  const vehicles = await listVehicles();
  const byKind = countByKind(vehicles);
  const kinds = Object.keys(byKind) as VehicleKind[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Frota
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Consolidação por categoria: ônibus, microônibus, vans e carros
          utilitários. Ideal para operação com poucos veículos e controle
          individualizado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kinds.map((kind) => (
          <div
            key={kind}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {vehicleKindLabel[kind]}
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {byKind[kind]}
            </p>
            <p className="mt-1 text-xs text-slate-500">veículo(s) cadastrado(s)</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Todos os veículos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Identificação</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Capacidade</th>
                <th className="px-5 py-3">Odômetro</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Rota escolar</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{v.plate}</p>
                    <p className="text-xs text-slate-500">{v.label}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {vehicleKindLabel[v.kind]}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {v.capacity} lugares
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {formatKm(v.odometerKm)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        v.status === "ativo"
                          ? "inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20"
                          : v.status === "manutencao"
                            ? "inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-600/25"
                            : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-500/15"
                      }
                    >
                      {v.status === "ativo"
                        ? "Ativo"
                        : v.status === "manutencao"
                          ? "Manutenção"
                          : "Inativo"}
                    </span>
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-3 text-slate-600">
                    {v.schoolRouteName ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/veiculos/${v.id}`}
                      className="text-xs font-medium text-emerald-700 hover:underline"
                    >
                      Ficha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
