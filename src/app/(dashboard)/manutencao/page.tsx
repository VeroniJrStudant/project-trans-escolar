import { MaintenanceLaunchForms } from "@/components/forms/maintenance-launch-forms";
import { MaintenanceTabs } from "@/components/manutencao/maintenance-tabs";
import {
  listFuelLogs,
  listPartMaintenances,
  listServiceMaintenances,
  listVehicles,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const [vehicles, parts, fuels, services] = await Promise.all([
    listVehicles(),
    listPartMaintenances(),
    listFuelLogs(),
    listServiceMaintenances(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Manutenção do veículo
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Registre peças, combustível e demais intervenções com vínculo ao
          odômetro. Os lançamentos são gravados no PostgreSQL.
        </p>
      </div>
      {vehicles.length ? <MaintenanceLaunchForms vehicles={vehicles} /> : null}
      <MaintenanceTabs
        parts={parts}
        fuels={fuels}
        services={services}
        vehicles={vehicles}
      />
    </div>
  );
}
