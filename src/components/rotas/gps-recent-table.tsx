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
      <p className="rounded-xl border border-dashed border-line bg-elevated-2 px-4 py-6 text-sm text-subtle">
        Nenhum ponto de telemetria armazenado ainda. Use a API{" "}
        <code className="rounded bg-elevated px-1 text-xs text-ink">
          POST /api/telemetry/ingest
        </code>{" "}
        com o header{" "}
        <code className="rounded bg-elevated px-1 text-xs text-ink">x-api-key</code>.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-elevated shadow-sm">
      <div className="border-b border-line-soft px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">Últimos pontos recebidos (telemetria)</h2>
        <p className="mt-1 text-xs text-subtle">
          Gravação em lote via API — útil para rastreador ou app do motorista.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-elevated-2 text-xs font-medium uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Coordenadas</th>
              <th className="px-4 py-3">Origem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {points.map((p) => (
              <tr key={p.id} className="hover:bg-elevated-2/80">
                <td className="whitespace-nowrap px-4 py-2.5 text-muted">
                  {formatDateTime(p.recordedAt)}
                </td>
                <td className="px-4 py-2.5 font-medium text-ink">{p.plate}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted">
                  {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                </td>
                <td className="px-4 py-2.5 text-muted">{p.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
