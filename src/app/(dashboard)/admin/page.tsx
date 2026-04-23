import { AdminUserCreateForm } from "@/components/forms/admin-user-create-form";
import { formatDateTime } from "@/lib/format";
import { listUsers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const users = await listUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Administrador
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Gestão de usuários e permissões. Acesso apenas para perfil ADMIN.
        </p>
      </div>

      <AdminUserCreateForm />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Usuários</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Papel</th>
                <th className="py-2 pr-4">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 pr-4 font-medium text-slate-800">{u.email}</td>
                  <td className="py-2 pr-4 text-slate-600">{u.name ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-slate-600">
                    {formatDateTime(u.createdAt.toISOString())}
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={4}>
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

