"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createVehicle } from "@/lib/actions/vehicles";
import type { ActionResult } from "@/lib/actions/types";
import { vehicleKindLabel } from "@/lib/types";
import type { VehicleKind } from "@/lib/types";

const kinds: VehicleKind[] = ["onibus", "microonibus", "van", "utilitario"];

export function VehicleCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);

  return (
    <form
      className="space-y-4 rounded-xl border border-line bg-elevated p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const r = await createVehicle(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
            router.push("/veiculos");
          }
        });
      }}
    >
      <h2 className="text-sm font-semibold text-ink">Novo veículo</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Placa" name="plate" required placeholder="ABC-1D23" />
        <Field label="Identificação / modelo" name="label" required />
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted">Tipo</label>
          <select
            name="kind"
            required
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            defaultValue="van"
          >
            {kinds.map((k) => (
              <option key={k} value={k}>
                {vehicleKindLabel[k]}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Capacidade (lugares)"
          name="capacity"
          type="number"
          required
          defaultValue={16}
        />
        <Field
          label="Odômetro (km)"
          name="odometerKm"
          type="number"
          required
          defaultValue={0}
        />
        <div>
          <label className="block text-xs font-medium text-muted">Status</label>
          <select
            name="status"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            defaultValue="ativo"
          >
            <option value="ativo">Ativo</option>
            <option value="manutencao">Manutenção</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <Field
          label="Próxima inspeção / doc."
          name="nextInspectionDate"
          type="date"
          required
        />
        <Field label="Motorista (opcional)" name="driverName" />
        <Field
          label="Rota escolar (opcional)"
          name="schoolRouteName"
          className="sm:col-span-2"
        />
      </div>
      {msg && !msg.ok ? (
        <p className="text-sm text-red-600" role="alert">
          {msg.error}
        </p>
      ) : null}
      {msg && msg.ok ? (
        <p className="text-sm text-emerald-700">{msg.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Cadastrar veículo"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
