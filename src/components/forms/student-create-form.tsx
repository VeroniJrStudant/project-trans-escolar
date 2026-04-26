"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createStudent } from "@/lib/actions/students";

export function StudentCreateForm() {
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
          const r = await createStudent(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
          }
        });
      }}
    >
      <h2 className="text-sm font-semibold text-ink">Novo aluno</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" required className="sm:col-span-2" />
        <Field label="Nascimento (opcional)" name="birthDate" type="date" />
        <Field label="Responsável (opcional)" name="guardianName" />
        <Field label="Telefone (opcional)" name="guardianPhone" />
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted" htmlFor="notes">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
            Pagamento (mensalidade)
          </p>
        </div>
        <Field
          label="Mensalidade (R$) (opcional)"
          name="tuitionMonthlyAmountBrl"
          type="number"
          className="sm:col-span-1"
        />
        <Field
          label="Vencimento (dia do mês) (opcional)"
          name="tuitionDueDay"
          type="number"
          className="sm:col-span-1"
        />
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-muted" htmlFor="tuitionPaymentMethod">
            Forma de pagamento (opcional)
          </label>
          <select
            id="tuitionPaymentMethod"
            name="tuitionPaymentMethod"
            defaultValue=""
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="">—</option>
            <option value="PIX">PIX</option>
            <option value="BOLETO">Boleto</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CARTAO">Cartão</option>
            <option value="TRANSFERENCIA">Transferência</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <Field
          label="Desconto (R$) (opcional)"
          name="tuitionDiscountBrl"
          type="number"
          className="sm:col-span-1"
        />
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
        {pending ? "Salvando…" : "Cadastrar aluno"}
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        step={
          type === "number"
            ? name === "tuitionDueDay"
              ? "1"
              : "0.01"
            : undefined
        }
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

