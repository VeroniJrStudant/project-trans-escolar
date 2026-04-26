import Link from "next/link";
import { FinanceSubnav } from "@/components/finance/finance-subnav";

export const dynamic = "force-dynamic";

export default function FinanceiroConfiguracaoPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/financeiro" className="text-accent-muted underline decoration-dotted hover:text-accent">
          Financeiro
        </Link>
        <span className="text-subtle"> · </span>
        <span className="text-ink">Configuração</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Configuração</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Espaço para políticas do financeiro (formas aceitas, observações padrão, etc.). Mantido para ficar com a
          mesma estrutura do projeto exemplo.
        </p>
      </header>

      <FinanceSubnav />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Em breve</h2>
        <p className="mt-2 text-sm text-muted">
          Quando você disser o que precisa aqui (ex.: métodos aceitos, recibo, exportação), eu implemento já dentro
          desse submenu.
        </p>
      </section>
    </div>
  );
}

