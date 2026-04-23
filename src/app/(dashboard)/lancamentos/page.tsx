import Link from "next/link";
import { ClipboardList, Fuel, MapPin, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/veiculos/novo",
    title: "Novo veículo",
    desc: "Ônibus, microônibus, van ou utilitário",
    icon: ClipboardList,
  },
  {
    href: "/rotas",
    title: "Viagem com trajeto",
    desc: "Datas, distância e JSON de pontos no mapa",
    icon: MapPin,
  },
  {
    href: "/manutencao",
    title: "Peças, combustível e serviços",
    desc: "Lançamentos por veículo com odômetro",
    icon: Wrench,
  },
];

export default function LancamentosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Central de lançamentos
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Atalhos para formulários web. Telemetria em lote usa a API documentada
          em <Link href="/rotas" className="font-medium text-emerald-700 hover:underline">Rotas</Link>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300/80 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-emerald-600 opacity-90" />
              <h2 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                {c.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">{c.desc}</p>
            </Link>
          );
        })}
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-sm">
          <Fuel className="h-8 w-8 text-emerald-400" />
          <h2 className="mt-3 text-sm font-semibold text-white">API GPS</h2>
          <p className="mt-1 text-xs text-slate-400">
            POST <code className="text-slate-200">/api/telemetry/ingest</code> +{" "}
            <code className="text-slate-200">x-api-key</code>
          </p>
          <Link
            href="/rotas"
            className="mt-3 inline-block text-xs font-medium text-emerald-300 hover:underline"
          >
            Ver exemplo de payload →
          </Link>
        </div>
      </div>
    </div>
  );
}
