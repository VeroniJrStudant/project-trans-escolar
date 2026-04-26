"use client";

import { useState } from "react";
import Link from "next/link";
import { formatBrl, formatDate, formatKm } from "@/lib/format";
import type { FuelLog, PartMaintenance, ServiceMaintenance, Vehicle } from "@/lib/types";

type Tab = "pecas" | "combustivel" | "servicos";

export function MaintenanceTabs({
  parts,
  fuels,
  services,
  vehicles,
}: {
  parts: PartMaintenance[];
  fuels: FuelLog[];
  services: ServiceMaintenance[];
  vehicles: Vehicle[];
}) {
  const [tab, setTab] = useState<Tab>("pecas");

  const tabs: { id: Tab; label: string }[] = [
    { id: "pecas", label: "Peças" },
    { id: "combustivel", label: "Combustível" },
    { id: "servicos", label: "Demais manutenções" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-elevated p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-sm sm:flex-none sm:px-4"
                : "flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium text-muted hover:bg-elevated-2 sm:flex-none sm:px-4"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pecas" ? (
        <TableShell
          title="Trocas e reparos por peça"
          description="Histórico por veículo — inclui custo e quilometragem do lançamento."
        >
          <thead className="bg-elevated-2 text-xs font-medium uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Veículo</th>
              <th className="px-4 py-3 text-left">Peça / conjunto</th>
              <th className="px-4 py-3 text-left">KM</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {parts.map((p) => {
              const v = vehicles.find((x) => x.id === p.vehicleId);
              return (
                <tr key={p.id} className="text-sm hover:bg-elevated-2/80">
                  <td className="px-4 py-3 text-muted">
                    {formatDate(p.date)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/veiculos/${p.vehicleId}`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {v?.plate ?? p.vehicleId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.partName}</p>
                    <p className="text-xs text-subtle">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatKm(p.odometerKm)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatBrl(p.costBrl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      ) : null}

      {tab === "combustivel" ? (
        <TableShell
          title="Abastecimento"
          description="Controle por tanque cheio ou parcial — ligue ao odômetro para média real."
        >
          <thead className="bg-elevated-2 text-xs font-medium uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Veículo</th>
              <th className="px-4 py-3 text-left">Posto</th>
              <th className="px-4 py-3 text-right">Litros</th>
              <th className="px-4 py-3 text-left">KM</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {fuels.map((f) => {
              const v = vehicles.find((x) => x.id === f.vehicleId);
              return (
                <tr key={f.id} className="text-sm hover:bg-elevated-2/80">
                  <td className="px-4 py-3 text-muted">
                    {formatDate(f.date)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/veiculos/${f.vehicleId}`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {v?.plate ?? f.vehicleId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{f.station ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-ink">
                    {f.liters.toLocaleString("pt-BR")} L
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatKm(f.odometerKm)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatBrl(f.costBrl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      ) : null}

      {tab === "servicos" ? (
        <TableShell
          title="Serviços e revisões"
          description="Alinhamento, inspeção, arrefecimento, elétrica, etc."
        >
          <thead className="bg-elevated-2 text-xs font-medium uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Veículo</th>
              <th className="px-4 py-3 text-left">Serviço</th>
              <th className="px-4 py-3 text-left">KM</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {services.map((s) => {
              const v = vehicles.find((x) => x.id === s.vehicleId);
              return (
                <tr key={s.id} className="text-sm hover:bg-elevated-2/80">
                  <td className="px-4 py-3 text-muted">
                    {formatDate(s.date)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/veiculos/${s.vehicleId}`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {v?.plate ?? s.vehicleId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{s.title}</p>
                    {s.notes ? (
                      <p className="text-xs text-subtle">{s.notes}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatKm(s.odometerKm)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatBrl(s.costBrl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      ) : null}
    </div>
  );
}

function TableShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-elevated shadow-sm">
      <div className="border-b border-line-soft px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-xs text-subtle">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">{children}</table>
      </div>
    </section>
  );
}
