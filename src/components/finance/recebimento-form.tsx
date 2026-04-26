"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createFinancialEntry } from "@/lib/actions/finance";

type StudentOpt = { id: string; name: string; active: boolean };

export function RecebimentoForm({ students }: { students: StudentOpt[] }) {
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
        fd.set("type", "receita");
        fd.set("category", "Mensalidade");
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
      <h2 className="text-sm font-semibold text-ink">Recebimento de mensalidade</h2>
      <p className="text-xs text-subtle">
        Registre um recebimento (receita) já realizado. Isso cria um lançamento em{" "}
        <span className="font-medium text-ink">Financeiro</span>.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-muted">Aluno</label>
          <select
            name="studentId"
            required
            defaultValue={activeStudents[0]?.id ?? ""}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {activeStudents.length ? null : <option value="">—</option>}
            {activeStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted" htmlFor="date">
            Data
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted" htmlFor="amountBrl">
            Valor (R$)
          </label>
          <input
            id="amountBrl"
            name="amountBrl"
            type="number"
            step="0.01"
            required
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-muted" htmlFor="notes">
            Observações (opcional)
          </label>
          <input
            id="notes"
            name="notes"
            placeholder="PIX, dinheiro, transferência, referência do recibo…"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
        {pending ? "Salvando…" : "Registrar recebimento"}
      </button>
    </form>
  );
}

