"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createFuelLog,
  createPartMaintenance,
  createServiceMaintenance,
} from "@/lib/actions/maintenance";
import type { ActionResult } from "@/lib/actions/types";
import type { Vehicle } from "@/lib/types";

export function MaintenanceLaunchForms({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"peca" | "combustivel" | "servico">("peca");
  const [msg, setMsg] = useState<ActionResult | null>(null);

  function submit(
    action: (
      p: ActionResult | undefined,
      fd: FormData,
    ) => Promise<ActionResult>,
  ) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMsg(null);
      const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const r = await action(undefined, fd);
        setMsg(r);
        if (r.ok) {
          e.currentTarget.reset();
          router.refresh();
        }
      });
    };
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Novo lançamento</h2>
        <div className="flex gap-1 rounded-lg border border-slate-200 p-0.5">
          {(
            [
              ["peca", "Peça"],
              ["combustivel", "Combustível"],
              ["servico", "Serviço"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setMsg(null);
              }}
              className={
                tab === id
                  ? "rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {msg ? (
        <p
          className={msg.ok ? "text-sm text-emerald-700" : "text-sm text-red-600"}
          role={msg.ok ? "status" : "alert"}
        >
          {msg.ok ? msg.message : msg.error}
        </p>
      ) : null}

      {tab === "peca" ? (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit(createPartMaintenance)}>
          <VehicleSelect vehicles={vehicles} />
          <Field label="Data" name="date" type="date" required />
          <Field label="Peça / conjunto" name="partName" required className="sm:col-span-2" />
          <Field label="Observação" name="description" required className="sm:col-span-2" />
          <Field label="Valor (R$)" name="costBrl" type="number" step="0.01" required />
          <Field label="KM no lançamento" name="odometerKm" type="number" required />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Salvando…" : "Salvar peça"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "combustivel" ? (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit(createFuelLog)}>
          <VehicleSelect vehicles={vehicles} />
          <Field label="Data" name="date" type="date" required />
          <Field label="Litros" name="liters" type="number" step="0.1" required />
          <Field label="Valor total (R$)" name="costBrl" type="number" step="0.01" required />
          <Field label="KM no abastecimento" name="odometerKm" type="number" required />
          <Field label="Posto (opcional)" name="station" className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Salvando…" : "Salvar abastecimento"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "servico" ? (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit(createServiceMaintenance)}>
          <VehicleSelect vehicles={vehicles} />
          <Field label="Data" name="date" type="date" required />
          <Field label="Serviço" name="title" required className="sm:col-span-2" />
          <Field label="Notas (opcional)" name="notes" className="sm:col-span-2" />
          <Field label="Valor (R$)" name="costBrl" type="number" step="0.01" required />
          <Field label="KM" name="odometerKm" type="number" required />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Salvando…" : "Salvar serviço"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function VehicleSelect({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-xs font-medium text-slate-600">Veículo</label>
      <select
        name="vehicleId"
        required
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        defaultValue={vehicles[0]?.id}
      >
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.plate} — {v.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  step?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-600" htmlFor={`m-${name}`}>
        {label}
      </label>
      <input
        id={`m-${name}`}
        name={name}
        type={type}
        step={step}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
      />
    </div>
  );
}
