import Link from "next/link";
import { notFound } from "next/navigation";
import { AddPassengerForm } from "@/components/viagens/add-passenger-form";
import { PassengerList } from "@/components/viagens/passenger-list";
import { formatDateTime } from "@/lib/format";
import { getEventTripById, listStudents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ViagemDetailPage({ params }: { params: { id: string } }) {
  const trip = await getEventTripById(params.id);
  if (!trip) notFound();

  const students = await listStudents();

  const total = trip.passengers.length;
  const paid = trip.passengers.filter((p) => p.status === "PAGO").length;
  const pending = total - paid;

  const msgConfirm = `Viagem confirmada: ${trip.title}\nSaída: ${formatDateTime(trip.departAt.toISOString())}\nOrigem: ${trip.origin}\nDestino: ${trip.destination}`;
  const msgPay = `Pagamento pendente da viagem: ${trip.title}\nValor: ${
    trip.priceBrl ? `R$ ${Number(trip.priceBrl).toFixed(2)}` : "(verificar)"
  }\nSaída: ${formatDateTime(trip.departAt.toISOString())}`;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-muted">
        <Link href="/viagens" className="text-accent-muted underline decoration-dotted hover:text-accent">
          Viagens
        </Link>
        <span className="text-subtle"> · </span>
        <span className="text-ink">{trip.title}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{trip.title}</h1>
        <p className="text-sm text-muted">
          {trip.origin} → {trip.destination}{" "}
          <span className="text-subtle">
            ({trip.direction === "IDA" ? "ida" : "ida e volta"})
          </span>
        </p>
        <p className="text-sm text-muted">
          Saída: <span className="font-medium text-ink">{formatDateTime(trip.departAt.toISOString())}</span>
          {trip.returnAt ? (
            <>
              {" "}
              · Volta: <span className="font-medium text-ink">{formatDateTime(trip.returnAt.toISOString())}</span>
            </>
          ) : null}
        </p>
        <p className="text-sm text-muted">
          Passageiros: <span className="font-semibold text-ink">{total}</span> · Pagos:{" "}
          <span className="font-semibold text-ink">{paid}</span> · Pendentes:{" "}
          <span className="font-semibold text-ink">{pending}</span>
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <AddPassengerForm tripId={trip.id} students={students.map((s) => ({ id: s.id, name: s.name, active: s.active }))} />
        <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">Mensagens rápidas</h2>
          <p className="mt-1 text-sm text-muted">
            Use os botões na lista para enviar por pessoa. Aqui ficam os textos-base.
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-line-soft bg-elevated-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Confirmação</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-ink">{msgConfirm}</pre>
            </div>
            <div className="rounded-lg border border-line-soft bg-elevated-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Cobrança</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-ink">{msgPay}</pre>
            </div>
          </div>
        </section>
      </section>

      <PassengerList trip={trip} />
    </div>
  );
}

