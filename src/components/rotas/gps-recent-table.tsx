import { formatDateTime } from "@/lib/format";

export function GpsRecentTable({
  points,
}: {
  points: {
    id: string;
    plate: string;
    lat: number;
    lng: number;
    recordedAt: string;
    source?: string;
  }[];
}) {
  if (!points.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        Nenhum ponto de telemetria armazenado ainda. Use a API{" "}
        <code className="rounded bg-white px-1 text-xs">POST /api/telemetry/ingest</code>{" "}
        com o header <code className="rounded bg-white px-1 text-xs">x-api-key</code>.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Últimos pontos recebidos (telemetria)
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Gravação em lote via API — útil para rastreador ou app do motorista.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Coordenadas</th>
              <th className="px-4 py-3">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {points.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                  {formatDateTime(p.recordedAt)}
                </td>
                <td className="px-4 py-2.5 font-medium text-slate-900">{p.plate}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-slate-600">
                  {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{p.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
