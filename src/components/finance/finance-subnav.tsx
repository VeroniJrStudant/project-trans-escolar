"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const items = [
  { href: "/financeiro", label: "Visão geral" },
  { href: "/financeiro/recebimento", label: "Recebimento" },
  { href: "/financeiro/pix-impresso", label: "PIX impresso" },
  { href: "/financeiro/lancamentos-lote", label: "Lançamentos em lote" },
  { href: "/financeiro/configuracao", label: "Configuração" },
] as const;

export function FinanceSubnav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-elevated p-1 shadow-sm">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cx(
              "flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition sm:flex-none sm:px-4",
              active
                ? "bg-accent text-on-accent shadow-sm"
                : "text-muted hover:bg-elevated-2 hover:text-ink",
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}

