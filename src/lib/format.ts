import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export function formatBrl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatKm(km: number): string {
  return `${km.toLocaleString("pt-BR")} km`;
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "dd MMM yyyy", { locale: ptBR });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: ptBR });
}
