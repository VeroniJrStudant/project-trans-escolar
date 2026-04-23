export function DbOfflineBanner() {
  return (
    <div
      className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-left text-sm text-amber-100"
      role="alert"
    >
      <p className="font-medium text-amber-200">Banco de dados inacessível</p>
      <p className="mt-2 text-xs leading-relaxed text-amber-100/90">
        O app não consegue falar com o PostgreSQL em{" "}
        <code className="rounded bg-black/30 px-1">localhost:5432</code> (veja o{" "}
        <code className="rounded bg-black/30 px-1">DATABASE_URL</code> no{" "}
        <code className="rounded bg-black/30 px-1">.env</code>).
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-4 text-xs text-amber-100/90">
        <li>Abra o Docker Desktop e aguarde iniciar.</li>
        <li>
          No terminal: <code className="rounded bg-black/30 px-1">npm run db:up</code>
        </li>
        <li>
          Depois:{" "}
          <code className="rounded bg-black/30 px-1">
            npx prisma migrate deploy
          </code>{" "}
          e{" "}
          <code className="rounded bg-black/30 px-1">npm run db:seed</code>
        </li>
      </ol>
      <p className="mt-3 text-xs text-amber-200/80">
        Com o container deste projeto, o nome do banco é{" "}
        <strong>transescolar</strong>, não <code className="rounded bg-black/30 px-1">mydb</code>.
        Exemplo de URL:{" "}
        <code className="mt-1 block break-all rounded bg-black/30 p-1.5 text-[10px] text-amber-50">
          postgresql://transescolar:transescolar@localhost:5432/transescolar?schema=public
        </code>
      </p>
    </div>
  );
}
