import Link from "next/link";
import { FinancialEntryCreateForm } from "@/components/forms/financial-entry-create-form";
import { FinanceSubnav } from "@/components/finance/finance-subnav";
import { AcceptedPaymentMethodsCard } from "@/components/finance/accepted-payment-methods-card";
import { RecentFinancialRecords } from "@/components/finance/recent-financial-records";
import { StudentFinanceContractsPanel } from "@/components/finance/student-finance-contracts-panel";
import { PAYMENT_METHOD_OPTIONS, type PaymentMethodCode } from "@/lib/finance/payment-methods";
import { formatBrl } from "@/lib/format";
import { listAcceptedPaymentMethods, listFinancialEntries, listStudents, listVehicles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams?: { studentId?: string; category?: string };
}) {
  const [entries, vehicles, students, accepted] = await Promise.all([
    listFinancialEntries(50),
    listVehicles(),
    listStudents(),
    listAcceptedPaymentMethods(),
  ]);

  const receita = entries
    .filter((e) => e.type === "RECEITA")
    .reduce((acc, e) => acc + Number(e.amountBrl), 0);
  const despesa = entries
    .filter((e) => e.type === "DESPESA")
    .reduce((acc, e) => acc + Number(e.amountBrl), 0);
  const saldo = receita - despesa;

  const allowed = new Set<PaymentMethodCode>(PAYMENT_METHOD_OPTIONS.map((o) => o.code));
  const acceptedRows = accepted
    .filter((r) => allowed.has(r.code as PaymentMethodCode))
    .map((r) => ({
      ...r,
      code: r.code as PaymentMethodCode,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Financeiro</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Registro simples de receitas e despesas (mensalidades, combustível, peças,
          serviços etc.).
        </p>
      </div>

      <FinanceSubnav />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/financeiro/recebimento"
          className="group rounded-2xl border border-line-soft bg-elevated-2 p-4 shadow-sm transition hover:border-accent-border hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-ink">Recebimento (mensalidades)</h2>
          <p className="mt-2 text-sm text-muted">
            Registrar pagamento recebido por aluno (PIX, dinheiro, transferência etc.).
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-accent-muted group-hover:underline">
            Abrir →
          </span>
        </Link>
        <Link
          href="/financeiro/pix-impresso"
          className="group rounded-2xl border border-line-soft bg-elevated-2 p-4 shadow-sm transition hover:border-accent-border hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-ink">PIX para impressão</h2>
          <p className="mt-2 text-sm text-muted">
            Gerar “copia e cola” e QR para imprimir e receber mais rápido.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-accent-muted group-hover:underline">
            Abrir →
          </span>
        </Link>
        <Link
          href="/financeiro/lancamentos-lote"
          className="group rounded-2xl border border-line-soft bg-elevated-2 p-4 shadow-sm transition hover:border-accent-border hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-ink">Lançamentos em lote</h2>
          <p className="mt-2 text-sm text-muted">
            Importar vários lançamentos de uma vez (CSV/linhas).
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-accent-muted group-hover:underline">
            Abrir →
          </span>
        </Link>
        <Link
          href="/financeiro/configuracao"
          className="group rounded-2xl border border-line-soft bg-elevated-2 p-4 shadow-sm transition hover:border-accent-border hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-ink">Configuração</h2>
          <p className="mt-2 text-sm text-muted">
            Preferências e políticas internas do financeiro (em breve).
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-accent-muted group-hover:underline">
            Abrir →
          </span>
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi title="Receitas" value={formatBrl(receita)} />
        <Kpi title="Despesas" value={formatBrl(despesa)} />
        <Kpi title="Saldo" value={formatBrl(saldo)} />
      </div>

      <AcceptedPaymentMethodsCard initial={acceptedRows} />

      <StudentFinanceContractsPanel
        students={students.map((s) => ({
          id: s.id,
          name: s.name,
          active: s.active,
          tuitionMonthlyAmountBrl: s.tuitionMonthlyAmountBrl?.toString() ?? null,
          tuitionDueDay: s.tuitionDueDay ?? null,
          tuitionPaymentMethod: s.tuitionPaymentMethod ?? null,
          tuitionDiscountBrl: s.tuitionDiscountBrl?.toString() ?? null,
        }))}
      />

      <RecentFinancialRecords
        rows={entries.map((e) => ({
          id: e.id,
          type: e.type,
          amountBrl: e.amountBrl.toString(),
          category: e.category,
          dateIso: e.date.toISOString(),
          studentName: e.student?.name ?? null,
          vehiclePlate: e.vehicle?.plate ?? null,
        }))}
      />

      <FinancialEntryCreateForm
        vehicles={vehicles}
        students={students}
        initialStudentId={searchParams?.studentId}
        initialCategory={searchParams?.category}
      />
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
      <p className="text-xs font-medium text-subtle">{title}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

