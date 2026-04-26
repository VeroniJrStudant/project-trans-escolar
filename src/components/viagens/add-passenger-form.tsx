"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { addTripPassenger } from "@/lib/actions/event-trips";

type StudentOpt = { id: string; name: string; active: boolean };

export function AddPassengerForm({
  tripId,
  students,
}: {
  tripId: string;
  students: StudentOpt[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<ActionResult | null>(null);
  const [useStudent, setUseStudent] = useState(true);

  const activeStudents = useMemo(() => students.filter((s) => s.active), [students]);

  return (
    <form
      className="space-y-4 rounded-xl border border-line bg-elevated p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        const fd = new FormData(e.currentTarget);
        fd.set("tripId", tripId);
        startTransition(async () => {
          const r = await addTripPassenger(undefined, fd);
          setMsg(r);
          if (r.ok) {
            e.currentTarget.reset();
            router.refresh();
          }
        });
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Adicionar passageiro</h2>
        <label className="text-xs font-medium text-muted">
          <input
            type="checkbox"
            checked={useStudent}
            onChange={(e) => setUseStudent(e.target.checked)}
            className="mr-1 align-middle"
          />
          Vincular a um aluno cadastrado
        </label>
      </div>

      {useStudent ? (
        <div>
          <label className="block text-xs font-medium text-muted">Aluno</label>
          <select
            name="studentId"
            defaultValue={activeStudents[0]?.id ?? ""}
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            onChange={(e) => {
              const opt = activeStudents.find((s) => s.id === e.target.value);
              const nameInput = (e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement | null);
              if (opt && nameInput) nameInput.value = opt.name;
            }}
          >
            {activeStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-subtle">
            Ao selecionar um aluno, o nome é preenchido automaticamente. Você pode ajustar se quiser.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" required className="sm:col-span-2" />
        <Field label="Telefone (opcional)" name="phone" placeholder="+55 48 99999-9999" />
        <Field label="E-mail (opcional)" name="email" placeholder="responsavel@email.com" />
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted" htmlFor="notes">
            Observações (opcional)
          </label>
          <input
            id="notes"
            name="notes"
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {msg && !msg.ok ? (
        <p className="text-sm text-danger-text" role="alert">
          {msg.error}
        </p>
      ) : null}
      {msg && msg.ok ? <p className="text-sm text-emerald-700">{msg.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Adicionar"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

