import Link from "next/link";
import { TripCreateForm } from "@/components/viagens/trip-create-form";
import { formatDateTime } from "@/lib/format";
import { listEventTrips } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ViagensPage() {
  const trips = await listEventTrips(60);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Viagens</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Cadastre viagens para festas e eventos (ponto A → B), com ida ou ida e volta. Depois adicione passageiros e
          controle pagamentos.
        </p>
      </header>

      <TripCreateForm />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Viagens cadastradas</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-subtle">
              <tr>
                <th className="py-2 pr-4">Saída</th>
                <th className="py-2 pr-4">Título</th>
                <th className="py-2 pr-4">Trecho</th>
                <th className="py-2 pr-4">Passageiros</th>
                <th className="py-2 pr-4">Lista</th>
                <th className="py-2 pr-4">Pagos</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {trips.map((t) => {
                const total = t.passengers.length;
                const paid = t.passengers.filter((p) => p.status === "PAGO").length;
                const first = t.passengers.slice(0, 4);
                const remaining = Math.max(0, total - first.length);
                return (
                  <tr key={t.id}>
                    <td className="py-2 pr-4 text-muted">{formatDateTime(t.departAt.toISOString())}</td>
                    <td className="py-2 pr-4 font-medium text-ink">{t.title}</td>
                    <td className="py-2 pr-4 text-muted">
                      {t.origin} → {t.destination}{" "}
                      <span className="text-xs text-subtle">
                        ({t.direction === "IDA" ? "ida" : "ida e volta"})
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-muted">{total}</td>
                    <td className="py-2 pr-4 text-muted">
                      {total ? (
                        <>
                          {first.map((p, idx) => (
                            <span key={`${p.name}-${idx}`} className="text-xs">
                              {idx ? <span className="text-subtle">, </span> : null}
                              <span className={p.status === "PAGO" ? "text-success-fg" : "text-warn-text"}>
                                {p.status === "PAGO" ? "✓ " : "• "}
                              </span>
                              <span className="text-muted">{p.name}</span>
                            </span>
                          ))}
                          {remaining ? <span className="text-xs text-subtle"> +{remaining}</span> : null}
                        </>
                      ) : (
                        <span className="text-xs text-subtle">—</span>
                      )}
                      <div>
                        <Link href={`/viagens/${t.id}`} className="text-xs font-medium text-accent hover:underline">
                          Ver lista →
                        </Link>
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-muted">
                      {paid} / {total}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <Link href={`/viagens/${t.id}`} className="text-xs font-medium text-accent hover:underline">
                        Abrir →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!trips.length ? (
                <tr>
                  <td className="py-3 text-subtle" colSpan={7}>
                    Nenhuma viagem cadastrada.
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

