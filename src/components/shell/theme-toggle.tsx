"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
  /** Versão compacta (só ícones) para cabeçalhos apertados. */
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (resolvedTheme ?? theme) as string | undefined;
  const isDark = mounted ? current === "dark" : false;

  // Mesmo estilo do projeto creche, mas usando as cores semânticas do app
  // (variáveis CSS já portadas para `globals.css`).
  const groupClass = compact
    ? "flex shrink-0 rounded-lg border border-line bg-elevated p-0.5"
    : "flex rounded-xl border border-line bg-elevated p-1";

  const btnBase = compact
    ? "flex items-center justify-center rounded-md p-1.5 transition"
    : "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition";

  const activeClass =
    "bg-accent-soft text-ink shadow-sm ring-1 ring-accent-border/60";

  const idleClass =
    "text-muted hover:bg-elevated-2 hover:text-ink";

  return (
    <div
      className={groupClass}
      role="group"
      aria-label="Tema claro ou escuro"
    >
      <button
        type="button"
        title="Tema claro"
        onClick={() => setTheme("light")}
        className={`${btnBase} ${mounted && !isDark ? activeClass : idleClass}`}
        aria-pressed={mounted && !isDark}
      >
        <Sun className="h-4 w-4 shrink-0" />
        {!compact ? "Claro" : null}
      </button>
      <button
        type="button"
        title="Tema escuro"
        onClick={() => setTheme("dark")}
        className={`${btnBase} ${mounted && isDark ? activeClass : idleClass}`}
        aria-pressed={mounted && isDark}
      >
        <Moon className="h-4 w-4 shrink-0" />
        {!compact ? "Escuro" : null}
      </button>
    </div>
  );
}

