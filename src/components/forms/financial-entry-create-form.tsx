"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createFinancialEntry } from "@/lib/actions/finance";

type VehicleOpt = { id: string; plate: string };
type StudentOpt = { id: string; name: string; active: boolean };

export function FinancialEntryCreateForm({
  vehicles,
  students,
  initialStudentId,
  initialCategory,
}: {
  vehicles: VehicleOpt[];
  students: StudentOpt[];
  initialStudentId?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);

  const activeStudents = useMemo(() => students.filter((s) => s.active), [students]);

  return (
    <form
      className="space-y-4 rounded-xl border border-line bg-elevated p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const r = await createFinancialEntry(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
          }
        });
      }}
    >
      <h2 className="text-sm font-semibold text-ink">Novo lançamento</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-muted">Tipo</label>
          <select
            name="type"
            defaultValue="despesa"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>
        <Field label="Data" name="date" type="date" required />
        <Field
          label="Categoria"
          name="category"
          required
          placeholder="Mensalidade, Combustível..."
          defaultValue={initialCategory}
        />
        <Field
          label="Valor (R$)"
          name="amountBrl"
          type="number"
          required
          placeholder="0.00"
        />
        <div>
          <label className="block text-xs font-medium text-muted">Aluno (opcional)</label>
          <select
            name="studentId"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            defaultValue={initialStudentId ?? ""}
          >
            <option value="">—</option>
            {activeStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted">Veículo (opcional)</label>
          <select
            name="vehicleId"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            defaultValue=""
          >
            <option value="">—</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate}
              </option>
            ))}
          </select>
        </div>
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
        <p className="text-sm text-red-600" role="alert">
          {msg.error}
        </p>
      ) : null}
      {msg && msg.ok ? <p className="text-sm text-emerald-700">{msg.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Registrar lançamento"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

