"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createEventTrip } from "@/lib/actions/event-trips";

export function TripCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);
  const [direction, setDirection] = useState<"ida" | "ida_volta">("ida_volta");

  return (
    <form
      className="space-y-4 rounded-xl border border-line bg-elevated p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const r = await createEventTrip(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            setDirection("ida_volta");
            router.refresh();
          }
        });
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Cadastrar viagem</h2>
        <div className="flex gap-2">
          <label className="text-xs font-medium text-muted">
            <input
              type="radio"
              name="direction"
              value="ida_volta"
              checked={direction === "ida_volta"}
              onChange={() => setDirection("ida_volta")}
              className="mr-1 align-middle"
            />
            Ida e volta
          </label>
          <label className="text-xs font-medium text-muted">
            <input
              type="radio"
              name="direction"
              value="ida"
              checked={direction === "ida"}
              onChange={() => setDirection("ida")}
              className="mr-1 align-middle"
            />
            Só ida
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Título" name="title" required className="lg:col-span-3" placeholder="Festa junina, excursão..." />
        <Field label="Origem (ponto A)" name="origin" required className="lg:col-span-2" placeholder="Escola, bairro..." />
        <Field label="Destino (ponto B)" name="destination" required className="lg:col-span-2" placeholder="Salão, sítio..." />
        <Field label="Saída" name="departAt" type="datetime-local" required />
        {direction === "ida_volta" ? (
          <Field label="Volta" name="returnAt" type="datetime-local" required />
        ) : (
          <div />
        )}
        <Field label="Preço por pessoa (R$) (opcional)" name="priceBrl" type="number" />
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-muted" htmlFor="notes">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {msg && !msg.ok ? (
        <p className="text-sm text-danger-text" role="alert">
          {msg.error}
        </p>
      ) : null}
      {msg && msg.ok ? <p className="text-sm text-emerald-700">{msg.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Cadastrar viagem"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

