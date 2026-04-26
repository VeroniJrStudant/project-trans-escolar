"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTrip } from "@/lib/actions/trips";
import type { ActionResult } from "@/lib/actions/types";
import type { Vehicle } from "@/lib/types";

const defaultWaypoints = `[
  {"lat":-23.55052,"lng":-46.633308},
  {"lat":-23.5521,"lng":-46.628},
  {"lat":-23.556,"lng":-46.624},
  {"lat":-23.561,"lng":-46.622}
]`;

export function TripCreateForm({ vehicles }: { vehicles: Vehicle[] }) {
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
          const r = await createTrip(undefined, fd);
          setMsg(r);
          if (r.ok) {
            router.refresh();
          }
        });
      }}
    >
      <h2 className="text-sm font-semibold text-ink">Registrar viagem com trajeto</h2>
      <p className="text-xs text-subtle">
        Informe início/fim, distância e um array JSON de pontos{" "}
        <code className="rounded bg-elevated-2 px-1">lat</code> /{" "}
        <code className="rounded bg-elevated-2 px-1">lng</code> na ordem da rota.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted">Veículo</label>
          <select
            name="vehicleId"
            required
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            defaultValue={vehicles[0]?.id}
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Nome da rota" name="routeName" required placeholder="Ida manhã" />
        <Field
          label="Distância (km)"
          name="distanceKm"
          type="number"
          step="0.1"
          required
        />
        <Field label="Paradas" name="stops" type="number" required defaultValue={0} />
        <Field
          label="Início"
          name="startedAt"
          type="datetime-local"
          required
        />
        <Field label="Fim" name="endedAt" type="datetime-local" required />
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted" htmlFor="waypointsJson">
            Pontos (JSON)
          </label>
          <textarea
            id="waypointsJson"
            name="waypointsJson"
            required
            rows={6}
            defaultValue={defaultWaypoints}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 font-mono text-xs text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
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
        {pending ? "Salvando…" : "Salvar viagem"}
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
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
  step?: string;
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
        step={step}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
