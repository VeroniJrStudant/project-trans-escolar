import { StudentCreateForm } from "@/components/forms/student-create-form";
import { listStudents } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const students = await listStudents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Alunos</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Cadastro básico de alunos e responsáveis (para referência e financeiro).
        </p>
      </div>

      <StudentCreateForm />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Cadastrados</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-subtle">
              <tr>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Nascimento</th>
                <th className="py-2 pr-4">Responsável</th>
                <th className="py-2 pr-4">Contato</th>
                <th className="py-2 pr-4">Mensalidade</th>
                <th className="py-2 pr-4">Venc.</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-4 font-medium text-ink">{s.name}</td>
                  <td className="py-2 pr-4 text-muted">
                    {s.birthDate ? formatDate(s.birthDate.toISOString()) : "—"}
                  </td>
                  <td className="py-2 pr-4 text-muted">{s.guardianName ?? "—"}</td>
                  <td className="py-2 pr-4 text-muted">{s.guardianPhone ?? "—"}</td>
                  <td className="py-2 pr-4 text-muted">
                    {s.tuitionMonthlyAmountBrl != null
                      ? Number(s.tuitionMonthlyAmountBrl).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "—"}
                  </td>
                  <td className="py-2 pr-4 text-muted">
                    {s.tuitionDueDay != null ? `dia ${s.tuitionDueDay}` : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    {s.active ? (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        ativo
                      </span>
                    ) : (
                      <span className="rounded bg-elevated-2 px-2 py-0.5 text-xs font-medium text-muted">
                        inativo
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <a
                      href={`/financeiro?studentId=${encodeURIComponent(s.id)}&category=${encodeURIComponent("Mensalidade")}`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Lançar pagamento →
                    </a>
                  </td>
                </tr>
              ))}
              {!students.length ? (
                <tr>
                  <td className="py-3 text-subtle" colSpan={8}>
                    Nenhum aluno cadastrado.
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

