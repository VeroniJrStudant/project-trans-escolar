"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createAnnouncement } from "@/lib/actions/announcements";

export function AnnouncementCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const r = await createAnnouncement(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
          }
        });
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Novo aviso</h2>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input type="checkbox" name="pinned" className="h-4 w-4" />
          Fixar
        </label>
      </div>

      <Field label="Título" name="title" required />
      <div>
        <label className="block text-xs font-medium text-slate-600" htmlFor="body">
          Mensagem
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
        />
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
        {pending ? "Publicando…" : "Publicar"}
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
      <label className="block text-xs font-medium text-slate-600" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
      />
    </div>
  );
}

