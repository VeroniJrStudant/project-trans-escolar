export type VehicleKind =
  | "onibus"
  | "microonibus"
  | "van"
  | "utilitario";

export type VehicleStatus = "ativo" | "manutencao" | "inativo";

export interface Vehicle {
  id: string;
  plate: string;
  label: string;
  kind: VehicleKind;
  capacity: number;
  odometerKm: number;
  status: VehicleStatus;
  nextInspectionDate: string;
  driverName?: string;
  schoolRouteName?: string;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
}

export interface RouteTrip {
  id: string;
  vehicleId: string;
  startedAt: string;
  endedAt: string;
  distanceKm: number;
  stops: number;
  routeName: string;
  path: RouteWaypoint[];
}

export interface PartMaintenance {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  partName: string;
  costBrl: number;
  odometerKm: number;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  costBrl: number;
  odometerKm: number;
  station?: string;
}

export interface ServiceMaintenance {
  id: string;
  vehicleId: string;
  date: string;
  title: string;
  notes?: string;
  costBrl: number;
  odometerKm: number;
}

export const vehicleKindLabel: Record<VehicleKind, string> = {
  onibus: "Ônibus",
  microonibus: "Microônibus",
  van: "Van",
  utilitario: "Utilitário",
};
