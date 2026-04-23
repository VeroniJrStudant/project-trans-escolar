import { StudentCreateForm } from "@/components/forms/student-create-form";
import { listStudents } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const students = await listStudents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Alunos</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Cadastro básico de alunos e responsáveis (para referência e financeiro).
        </p>
      </div>

      <StudentCreateForm />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Cadastrados</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Nascimento</th>
                <th className="py-2 pr-4">Responsável</th>
                <th className="py-2 pr-4">Contato</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-4 font-medium text-slate-800">{s.name}</td>
                  <td className="py-2 pr-4 text-slate-600">
                    {s.birthDate ? formatDate(s.birthDate.toISOString()) : "—"}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{s.guardianName ?? "—"}</td>
                  <td className="py-2 pr-4 text-slate-600">{s.guardianPhone ?? "—"}</td>
                  <td className="py-2 pr-4">
                    {s.active ? (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        ativo
                      </span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        inativo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!students.length ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={5}>
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

