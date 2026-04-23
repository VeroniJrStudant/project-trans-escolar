import {
  BadgeDollarSign,
  Bus,
  ClipboardList,
  Megaphone,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  UserCog,
  UsersRound,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navItems: NavItem[] = [
  { href: "/", label: "Visão geral", icon: LayoutDashboard },
  { href: "/frota", label: "Frota", icon: UsersRound },
  { href: "/veiculos", label: "Veículos", icon: Bus },
  { href: "/rotas", label: "Rotas percorridas", icon: MapPinned },
  { href: "/manutencao", label: "Manutenção", icon: Wrench },
  { href: "/lancamentos", label: "Lançamentos", icon: ClipboardList },
  { href: "/financeiro", label: "Financeiro", icon: BadgeDollarSign },
  { href: "/mural", label: "Mural", icon: Megaphone },
  { href: "/alunos", label: "Alunos", icon: UsersRound },
  { href: "/seguranca", label: "Segurança", icon: ShieldCheck },
  { href: "/admin", label: "Administrador", icon: UserCog },
];
