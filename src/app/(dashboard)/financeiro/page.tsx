import { FinancialEntryCreateForm } from "@/components/forms/financial-entry-create-form";
import { formatBrl, formatDate } from "@/lib/format";
import { listFinancialEntries, listStudents, listVehicles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const [entries, vehicles, students] = await Promise.all([
    listFinancialEntries(80),
    listVehicles(),
    listStudents(),
  ]);

  const receita = entries
    .filter((e) => e.type === "RECEITA")
    .reduce((acc, e) => acc + Number(e.amountBrl), 0);
  const despesa = entries
    .filter((e) => e.type === "DESPESA")
    .reduce((acc, e) => acc + Number(e.amountBrl), 0);
  const saldo = receita - despesa;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Financeiro
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Registro simples de receitas e despesas (mensalidades, combustível, peças,
          serviços etc.).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi title="Receitas" value={formatBrl(receita)} />
        <Kpi title="Despesas" value={formatBrl(despesa)} />
        <Kpi title="Saldo" value={formatBrl(saldo)} />
      </div>

      <FinancialEntryCreateForm vehicles={vehicles} students={students} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Lançamentos</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Aluno</th>
                <th className="py-2 pr-4">Veículo</th>
                <th className="py-2 pr-4">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="py-2 pr-4 text-slate-600">
                    {formatDate(e.date.toISOString())}
                  </td>
                  <td className="py-2 pr-4">
                    {e.type === "RECEITA" ? (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        receita
                      </span>
                    ) : (
                      <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-800">
                        despesa
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 font-medium text-slate-800">{e.category}</td>
                  <td className="py-2 pr-4 text-slate-600">{e.student?.name ?? "—"}</td>
                  <td className="py-2 pr-4 text-slate-600">{e.vehicle?.plate ?? "—"}</td>
                  <td className="py-2 pr-4 font-medium text-slate-800">
                    {formatBrl(Number(e.amountBrl))}
                  </td>
                </tr>
              ))}
              {!entries.length ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={6}>
                    Nenhum lançamento.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

