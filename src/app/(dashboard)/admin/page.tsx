import { AdminUserCreateForm } from "@/components/forms/admin-user-create-form";
import { formatDateTime } from "@/lib/format";
import { listUsers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const users = await listUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Administrador</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Gestão de usuários e permissões. Acesso apenas para perfil ADMIN.
        </p>
      </div>

      <AdminUserCreateForm />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Usuários</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-subtle">
              <tr>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Papel</th>
                <th className="py-2 pr-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 pr-4 font-medium text-ink">{u.email}</td>
                  <td className="py-2 pr-4 text-muted">{u.name ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded bg-elevated-2 px-2 py-0.5 text-xs font-medium text-muted">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-muted">
                    {formatDateTime(u.createdAt.toISOString())}
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td className="py-3 text-subtle" colSpan={4}>
                    Nenhum usuário.
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

