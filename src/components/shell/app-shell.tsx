"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { navItems } from "./nav-items";

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={cx(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40">
              <span className="text-sm font-bold tracking-tight">TE</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">TransEscolar</p>
              <p className="text-xs text-slate-400">Frota &amp; manutenção</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-slate-800 p-3 text-xs text-slate-500">
            {session?.user?.email ? (
              <p className="mb-2 truncate text-slate-400">{session.user.email}</p>
            ) : null}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full rounded-lg border border-slate-700 py-1.5 text-center text-slate-300 hover:bg-slate-800"
            >
              Sair
            </button>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Transporte escolar
              </p>
              <p className="truncate text-xs text-slate-500">
                {session?.user?.name ?? session?.user?.email ?? "Painel operacional"}
              </p>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
