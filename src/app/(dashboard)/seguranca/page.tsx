import { formatDateTime } from "@/lib/format";
import { listAuditLogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SegurancaPage() {
  const logs = await listAuditLogs(120);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Segurança</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Auditoria básica de ações no sistema (cadastros e lançamentos).
        </p>
      </div>

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Logs recentes</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-subtle">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Ator</th>
                <th className="py-2 pr-4">Ação</th>
                <th className="py-2 pr-4">Entidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="py-2 pr-4 text-muted">
                    {formatDateTime(l.createdAt.toISOString())}
                  </td>
                  <td className="py-2 pr-4 text-muted">
                    <span className="font-medium">
                      {l.actor.name ?? l.actor.email}
                    </span>{" "}
                    <span className="text-xs text-subtle">({l.actor.role})</span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-muted">
                    {l.action}
                  </td>
                  <td className="py-2 pr-4 text-muted">
                    {l.entity ? (
                      <span>
                        {l.entity}
                        {l.entityId ? (
                          <span className="text-xs text-subtle/80"> · {l.entityId}</span>
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
                  <td className="py-3 text-subtle" colSpan={4}>
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

