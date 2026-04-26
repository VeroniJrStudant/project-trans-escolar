"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { adminCreateUser } from "@/lib/actions/admin";

export function AdminUserCreateForm() {
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
          const r = await adminCreateUser(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
          }
        });
      }}
    >
      <h2 className="text-sm font-semibold text-ink">Criar usuário</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" required />
        <Field label="E-mail" name="email" type="email" required />
        <Field label="Senha" name="password" type="password" required />
        <div>
          <label className="block text-xs font-medium text-muted">Papel</label>
          <select
            name="role"
            defaultValue="operador"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="admin">Admin</option>
            <option value="operador">Operador</option>
            <option value="leitor">Leitor</option>
          </select>
        </div>
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
        {pending ? "Criando…" : "Criar usuário"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

