import Link from "next/link";
import { FinanceSubnav } from "@/components/finance/finance-subnav";

export const dynamic = "force-dynamic";

export default function LancamentosLotePage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/financeiro" className="text-accent-muted underline decoration-dotted hover:text-accent">
          Financeiro
        </Link>
        <span className="text-subtle"> · </span>
        <span className="text-ink">Lançamentos em lote</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Lançamentos em lote</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Estrutura de submenu igual ao projeto exemplo. Importação/edição em lote será adicionada aqui na próxima
          etapa.
        </p>
      </header>

      <FinanceSubnav />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Em breve</h2>
        <p className="mt-2 text-sm text-muted">
          Ideia: colar linhas CSV (data;tipo;categoria;valor;aluno;veiculo;obs) e o sistema cria todos os
          lançamentos.
        </p>
      </section>
    </div>
  );
}

