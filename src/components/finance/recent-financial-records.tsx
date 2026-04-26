import { formatBrl, formatDateTime } from "@/lib/format";

export type RecentRow = {
  id: string;
  type: "RECEITA" | "DESPESA";
  amountBrl: string;
  category: string;
  dateIso: string;
  studentName: string | null;
  vehiclePlate: string | null;
};

export function RecentFinancialRecords({ rows }: { rows: RecentRow[] }) {
  return (
    <section className="rounded-2xl border border-line-soft bg-elevated-2 px-4 py-4 shadow-sm sm:px-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-muted">
        Movimentação
      </p>
      <h2 className="mt-1 text-sm font-semibold text-ink">Lançamentos recentes</h2>
      <p className="mt-1 text-sm text-muted">Últimos registros (até 50).</p>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nenhum lançamento cadastrado ainda.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-line bg-elevated px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-ink">
                  {r.category} {r.type === "DESPESA" ? "(saída)" : ""}
                </span>
                <span className={`text-sm font-semibold ${r.type === "RECEITA" ? "text-accent-muted" : "text-muted"}`}>
                  {r.type === "RECEITA" ? "+" : "−"}
                  {formatBrl(Number(r.amountBrl))}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {formatDateTime(r.dateIso)}
                {r.studentName ? ` · ${r.studentName}` : ""}
                {r.vehiclePlate ? ` · ${r.vehiclePlate}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

