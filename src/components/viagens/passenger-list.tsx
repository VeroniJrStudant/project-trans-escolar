"use client";

import { useMemo, useState, useTransition } from "react";
import { removeTripPassenger, setPassengerPaymentStatus } from "@/lib/actions/event-trips";

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function makeWhatsappLink(phone: string, text: string) {
  const digits = onlyDigits(phone);
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function makeMailto(email: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function PassengerList({
  trip,
}: {
  trip: {
    id: string;
    title: string;
    origin: string;
    destination: string;
    departAt: Date;
    priceBrl: unknown;
    passengers: Array<{
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
      status: "PAGO" | "PENDENTE";
      paidAt: Date | null;
      notes: string | null;
    }>;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");

  const payText = useMemo(() => {
    const v = typeof trip.priceBrl === "number" ? trip.priceBrl : null;
    return `Pagamento pendente da viagem: ${trip.title}\nTrecho: ${trip.origin} → ${trip.destination}\nValor: ${
      v != null ? `R$ ${v.toFixed(2)}` : "(verificar)"
    }`;
  }, [trip.destination, trip.origin, trip.priceBrl, trip.title]);

  const confirmText = useMemo(() => {
    return `Viagem confirmada: ${trip.title}\nTrecho: ${trip.origin} → ${trip.destination}\nNos vemos no embarque.`;
  }, [trip.destination, trip.origin, trip.title]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return trip.passengers;
    return trip.passengers.filter((p) => {
      return [p.name, p.phone ?? "", p.email ?? "", p.status].join(" ").toLowerCase().includes(t);
    });
  }, [q, trip.passengers]);

  return (
    <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">Passageiros</h2>
          <p className="mt-1 text-sm text-muted">
            Marque como pago/pendente e envie mensagem de confirmação ou cobrança.
          </p>
        </div>
        <div className="sm:w-72">
          <label className="block text-xs font-medium text-muted" htmlFor="p-q">
            Buscar
          </label>
          <input
            id="p-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nome, telefone, e-mail..."
            className="mt-1 w-full rounded-lg border border-line bg-elevated-2 px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs text-subtle">
            <tr>
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4">Contato</th>
              <th className="py-2 pr-4">Pagamento</th>
              <th className="py-2 pr-4">Ações</th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="py-2 pr-4">
                  <p className="font-medium text-ink">{p.name}</p>
                  {p.notes ? <p className="text-xs text-subtle">{p.notes}</p> : null}
                </td>
                <td className="py-2 pr-4 text-muted">
                  <p>{p.phone ?? "—"}</p>
                  <p className="text-xs text-subtle">{p.email ?? ""}</p>
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      p.status === "PAGO"
                        ? "inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20"
                        : "inline-flex rounded-full bg-warn-bg px-2 py-0.5 text-xs font-medium text-warn-text ring-1 ring-warn-border/60"
                    }
                  >
                    {p.status === "PAGO" ? "pago" : "pendente"}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await setPassengerPaymentStatus({
                            passengerId: p.id,
                            status: p.status === "PAGO" ? "PENDENTE" : "PAGO",
                          });
                        })
                      }
                      className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:bg-elevated-2 disabled:opacity-60"
                    >
                      {p.status === "PAGO" ? "Marcar pendente" : "Marcar pago"}
                    </button>

                    {p.phone ? (
                      <>
                        <a
                          href={makeWhatsappLink(p.phone, confirmText)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent hover:bg-accent-hover"
                        >
                          WhatsApp confirmação
                        </a>
                        <a
                          href={makeWhatsappLink(p.phone, payText)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:bg-elevated-2"
                        >
                          WhatsApp cobrança
                        </a>
                      </>
                    ) : null}

                    {p.email ? (
                      <a
                        href={makeMailto(p.email, `Viagem: ${trip.title}`, confirmText)}
                        className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:bg-elevated-2"
                      >
                        E-mail
                      </a>
                    ) : null}
                  </div>
                </td>
                <td className="py-2 pr-0 text-right">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await removeTripPassenger({ passengerId: p.id });
                      })
                    }
                    className="text-xs font-medium text-danger-text hover:underline disabled:opacity-60"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td className="py-3 text-subtle" colSpan={5}>
                  Nenhum passageiro.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

