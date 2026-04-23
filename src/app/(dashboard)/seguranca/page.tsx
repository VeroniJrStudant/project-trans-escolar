import { formatDateTime } from "@/lib/format";
import { listAuditLogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SegurancaPage() {
  const logs = await listAuditLogs(120);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Segurança
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Auditoria básica de ações no sistema (cadastros e lançamentos).
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Logs recentes</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Ator</th>
                <th className="py-2 pr-4">Ação</th>
                <th className="py-2 pr-4">Entidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="py-2 pr-4 text-slate-600">
                    {formatDateTime(l.createdAt.toISOString())}
                  </td>
                  <td className="py-2 pr-4 text-slate-700">
                    <span className="font-medium">
                      {l.actor.name ?? l.actor.email}
                    </span>{" "}
                    <span className="text-xs text-slate-500">({l.actor.role})</span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-700">
                    {l.action}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">
                    {l.entity ? (
                      <span>
                        {l.entity}
                        {l.entityId ? (
                          <span className="text-xs text-slate-400"> · {l.entityId}</span>
                        ) : null}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {!logs.length ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={4}>
                    Nenhum log ainda.
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

