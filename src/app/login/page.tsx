import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isDatabaseReachable } from "@/lib/db-ping";
import { DbOfflineBanner } from "./db-offline-banner";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  const dbOk = await isDatabaseReachable();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        {!dbOk ? <DbOfflineBanner /> : null}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40">
            <span className="text-lg font-bold">TE</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-white">TransEscolar</h1>
          <p className="mt-1 text-sm text-slate-400">
            Entre para gerenciar frota e manutenção
          </p>
        </div>
        <LoginForm dbUnreachable={!dbOk} />
        <p className="mt-6 text-center text-xs text-slate-500">
          Após o seed: <span className="text-slate-400">admin@escola.local</span> /{" "}
          <span className="text-slate-400">admin123</span>
        </p>
      </div>
    </div>
  );
}
