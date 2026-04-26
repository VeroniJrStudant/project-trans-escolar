import { listAnnouncements } from "@/lib/queries";
import { AnnouncementCreateForm } from "@/components/forms/announcement-create-form";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MuralPage() {
  const items = await listAnnouncements(40);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Mural</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Comunicados e avisos internos. Fixe itens importantes no topo.
        </p>
      </div>

      <AnnouncementCreateForm />

      <section className="rounded-xl border border-line bg-elevated p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Publicações</h2>
        <ul className="mt-4 space-y-3">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-line-soft bg-elevated-2 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-ink">
                  {a.title}{" "}
                  {a.pinned ? (
                    <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      fixado
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-subtle">
                  {formatDateTime(a.publishedAt.toISOString())} ·{" "}
                  {a.author.name ?? a.author.email}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                {a.body}
              </p>
            </li>
          ))}
          {!items.length ? (
            <li className="text-sm text-subtle">Nenhuma publicação ainda.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}

