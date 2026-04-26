"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PAYMENT_METHOD_LABEL_BY_CODE } from "@/lib/finance/payment-methods";

type StudentFinanceRow = {
  id: string;
  name: string;
  active: boolean;
  tuitionMonthlyAmountBrl: string | null;
  tuitionDueDay: number | null;
  tuitionPaymentMethod: string | null;
  tuitionDiscountBrl: string | null;
};

function tokens(q: string) {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

export function StudentFinanceContractsPanel({ students }: { students: StudentFinanceRow[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const tks = useMemo(() => tokens(q), [q]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (status === "active" && !s.active) return false;
      if (status === "inactive" && s.active) return false;
      if (tks.length === 0) return true;
      const hay = [
        s.name,
        s.active ? "ativo" : "inativo",
        s.tuitionPaymentMethod ?? "",
        s.tuitionDueDay != null ? String(s.tuitionDueDay) : "",
      ]
        .join(" ")
        .toLowerCase();
      return tks.every((x) => hay.includes(x));
    });
  }, [students, status, tks]);

  if (!students.length) return null;

  return (
    <section className="rounded-2xl border border-line-soft bg-elevated-2 px-4 py-4 shadow-sm sm:px-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-muted">
        Contrato por aluno
      </p>
      <h2 className="mt-1 text-sm font-semibold text-ink">Pagamento / mensalidade cadastrada</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted">
        Use como conferência rápida. Para editar valores e forma preferida, abra o cadastro do aluno.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted" htmlFor="fin-students-q">
            Buscar
          </label>
          <input
            id="fin-students-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nome, forma, vencimento…"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted" htmlFor="fin-students-status">
            Status
          </label>
          <select
            id="fin-students-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line bg-elevated text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Aluno</th>
              <th className="px-3 py-2 font-medium">Mensalidade</th>
              <th className="px-3 py-2 font-medium">Desconto</th>
              <th className="px-3 py-2 font-medium">Venc.</th>
              <th className="px-3 py-2 font-medium">Forma</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-elevated-2">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="px-3 py-2">
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-subtle">{s.active ? "ativo" : "inativo"}</p>
                </td>
                <td className="px-3 py-2 text-muted">
                  {s.tuitionMonthlyAmountBrl != null
                    ? Number(s.tuitionMonthlyAmountBrl).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "—"}
                </td>
                <td className="px-3 py-2 text-muted">
                  {s.tuitionDiscountBrl != null
                    ? Number(s.tuitionDiscountBrl).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "—"}
                </td>
                <td className="px-3 py-2 text-muted">
                  {s.tuitionDueDay != null ? `dia ${s.tuitionDueDay}` : "—"}
                </td>
                <td className="px-3 py-2 text-muted">
                  {s.tuitionPaymentMethod
                    ? PAYMENT_METHOD_LABEL_BY_CODE.get(s.tuitionPaymentMethod) ?? s.tuitionPaymentMethod
                    : "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/alunos#${encodeURIComponent(s.id)}`}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Ver aluno →
                  </Link>
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td className="px-3 py-3 text-subtle" colSpan={6}>
                  Nenhum aluno encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

