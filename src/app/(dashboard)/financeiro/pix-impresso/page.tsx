import Link from "next/link";
import { FinanceSubnav } from "@/components/finance/finance-subnav";

export const dynamic = "force-dynamic";

export default function PixImpressoPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/financeiro" className="text-accent-muted underline decoration-dotted hover:text-accent">
          Financeiro
        </Link>
        <span className="text-subtle"> · </span>
        <span className="text-ink">PIX impresso</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">PIX para impressão</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Atalho para secretaria: gere o pagamento e registre no recebimento. (Painel de QR/“copia e cola” em
          breve.)
        </p>
      </header>

      <FinanceSubnav />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Como usar agora</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-muted">
          <li>Abra “Recebimento”.</li>
          <li>Selecione o aluno e registre o valor recebido via PIX.</li>
          <li>Use o campo de observações para guardar a referência do comprovante.</li>
        </ol>
        <Link
          href="/financeiro/recebimento"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-hover"
        >
          Ir para Recebimento →
        </Link>
      </section>
    </div>
  );
}

