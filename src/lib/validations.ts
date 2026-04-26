import { z } from "zod";

const vehicleKindSchema = z.enum(["onibus", "microonibus", "van", "utilitario"]);

const vehicleStatusSchema = z.enum(["ativo", "manutencao", "inativo"]);

export const vehicleCreateSchema = z.object({
  plate: z.string().min(5).max(12).transform((s) => s.toUpperCase().trim()),
  label: z.string().min(2).max(120),
  kind: vehicleKindSchema,
  capacity: z.coerce.number().int().min(1).max(120),
  odometerKm: z.coerce.number().int().min(0),
  status: vehicleStatusSchema,
  nextInspectionDate: z.string().min(8),
  driverName: z.string().max(120).optional().transform((s) => s?.trim() || undefined),
  schoolRouteName: z
    .string()
    .max(200)
    .optional()
    .transform((s) => s?.trim() || undefined),
});

export const partCreateSchema = z.object({
  vehicleId: z.string().min(1),
  date: z.string().min(8),
  partName: z.string().min(2).max(200),
  description: z.string().min(1).max(500),
  costBrl: z.coerce.number().positive(),
  odometerKm: z.coerce.number().int().min(0),
});

export const fuelCreateSchema = z.object({
  vehicleId: z.string().min(1),
  date: z.string().min(8),
  liters: z.coerce.number().positive(),
  costBrl: z.coerce.number().positive(),
  odometerKm: z.coerce.number().int().min(0),
  station: z
    .string()
    .max(200)
    .optional()
    .transform((s) => s?.trim() || undefined),
});

export const serviceCreateSchema = z.object({
  vehicleId: z.string().min(1),
  date: z.string().min(8),
  title: z.string().min(2).max(200),
  notes: z
    .string()
    .max(2000)
    .optional()
    .transform((s) => s?.trim() || undefined),
  costBrl: z.coerce.number().min(0),
  odometerKm: z.coerce.number().int().min(0),
});

const waypointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const tripCreateSchema = z.object({
  vehicleId: z.string().min(1),
  routeName: z.string().min(2).max(200),
  startedAt: z.string().min(8),
  endedAt: z.string().min(8),
  distanceKm: z.coerce.number().min(0),
  stops: z.coerce.number().int().min(0),
  waypointsJson: z.string().min(4),
});

export type TripWaypointsInput = z.infer<typeof waypointSchema>[];

export function parseTripWaypoints(json: string): TripWaypointsInput {
  const raw = JSON.parse(json) as unknown;
  return z.array(waypointSchema).parse(raw);
}

export const telemetryIngestSchema = z.object({
  vehicleId: z.string().min(1),
  points: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        recordedAt: z.string().min(4),
        source: z.string().max(120).optional(),
      }),
    )
    .min(1)
    .max(2000),
});

export const announcementCreateSchema = z.object({
  title: z.string().min(2).max(120).transform((s) => s.trim()),
  body: z.string().min(2).max(4000).transform((s) => s.trim()),
  pinned: z.coerce.boolean().optional(),
});

export const studentCreateSchema = z.object({
  name: z.string().min(2).max(160).transform((s) => s.trim()),
  birthDate: z.string().optional(),
  guardianName: z.string().max(160).optional().transform((s) => s?.trim() || undefined),
  guardianPhone: z.string().max(60).optional().transform((s) => s?.trim() || undefined),
  notes: z.string().max(2000).optional().transform((s) => s?.trim() || undefined),
  active: z.coerce.boolean().optional(),
  tuitionMonthlyAmountBrl: z.coerce
    .number()
    .min(0)
    .max(9_999_999.99)
    .optional()
    .transform((n) => (Number.isFinite(n) ? n : undefined)),
  tuitionDueDay: z.coerce
    .number()
    .int()
    .min(1)
    .max(31)
    .optional()
    .transform((n) => (Number.isFinite(n) ? n : undefined)),
  tuitionPaymentMethod: z
    .string()
    .max(40)
    .optional()
    .transform((s) => s?.trim() || undefined),
  tuitionDiscountBrl: z.coerce
    .number()
    .min(0)
    .max(9_999_999.99)
    .optional()
    .transform((n) => (Number.isFinite(n) ? n : undefined)),
});

export const financialEntryCreateSchema = z.object({
  type: z.enum(["receita", "despesa"]),
  date: z.string().min(8),
  category: z.string().min(2).max(120).transform((s) => s.trim()),
  amountBrl: z.coerce.number().positive(),
  notes: z.string().max(2000).optional().transform((s) => s?.trim() || undefined),
  vehicleId: z.string().optional().transform((s) => (s ? s : undefined)),
  studentId: z.string().optional().transform((s) => (s ? s : undefined)),
});

export const eventTripCreateSchema = z
  .object({
    title: z.string().min(2).max(120).transform((s) => s.trim()),
    origin: z.string().min(2).max(200).transform((s) => s.trim()),
    destination: z.string().min(2).max(200).transform((s) => s.trim()),
    direction: z.enum(["ida", "ida_volta"]),
    departAt: z.string().min(8),
    returnAt: z.string().optional(),
    priceBrl: z.coerce.number().min(0).max(9_999_999.99).optional(),
    notes: z.string().max(2000).optional().transform((s) => s?.trim() || undefined),
  })
  .superRefine((v, ctx) => {
    if (v.direction === "ida_volta") {
      if (!v.returnAt || String(v.returnAt).trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe a data/hora de volta para viagens de ida e volta.",
          path: ["returnAt"],
        });
      }
    }
  });

export const tripPassengerCreateSchema = z.object({
  tripId: z.string().min(1),
  studentId: z.string().optional().transform((s) => (s ? s : undefined)),
  name: z.string().min(2).max(160).transform((s) => s.trim()),
  phone: z.string().max(80).optional().transform((s) => s?.trim() || undefined),
  email: z.string().email().optional().transform((s) => s?.trim().toLowerCase() || undefined),
  notes: z.string().max(2000).optional().transform((s) => s?.trim() || undefined),
});

export const adminUserCreateSchema = z.object({
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  name: z.string().min(2).max(160).transform((s) => s.trim()),
  password: z.string().min(6).max(200),
  role: z.enum(["admin", "operador", "leitor"]),
});
