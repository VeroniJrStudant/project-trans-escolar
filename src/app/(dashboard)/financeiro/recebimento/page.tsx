import Link from "next/link";
import { FinanceSubnav } from "@/components/finance/finance-subnav";
import { RecebimentoForm } from "@/components/finance/recebimento-form";
import { listStudents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RecebimentoPage() {
  const students = await listStudents();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/financeiro" className="text-accent-muted underline decoration-dotted hover:text-accent">
          Financeiro
        </Link>
        <span className="text-subtle"> · </span>
        <span className="text-ink">Recebimento</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Recebimento</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Registre recebimentos de mensalidade por aluno. Para outros tipos de receita/despesa, use a visão geral.
        </p>
      </header>

      <FinanceSubnav />

      <RecebimentoForm students={students.map((s) => ({ id: s.id, name: s.name, active: s.active }))} />
    </div>
  );
}

