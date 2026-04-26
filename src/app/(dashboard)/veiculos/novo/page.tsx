import Link from "next/link";
import { VehicleCreateForm } from "@/components/forms/vehicle-create-form";

export const dynamic = "force-dynamic";

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/veiculos"
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          ← Voltar para veículos
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Novo veículo
        </h1>
        <p className="mt-1 text-sm text-muted">
          Cadastro persistido no PostgreSQL. Placa deve ser única.
        </p>
      </div>
      <VehicleCreateForm />
    </div>
  );
}
