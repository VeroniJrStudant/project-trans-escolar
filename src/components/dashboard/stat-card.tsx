export function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-elevated p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-subtle">
        {title}
      </p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
