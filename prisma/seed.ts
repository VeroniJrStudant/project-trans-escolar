import { PrismaClient, VehicleKind, VehicleStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const basePath = [
  { lat: -23.55052, lng: -46.633308 },
  { lat: -23.5521, lng: -46.628 },
  { lat: -23.556, lng: -46.624 },
  { lat: -23.561, lng: -46.622 },
  { lat: -23.565, lng: -46.625 },
  { lat: -23.568, lng: -46.631 },
  { lat: -23.5665, lng: -46.638 },
];

async function main() {
  await prisma.gpsPoint.deleteMany();
  await prisma.routeWaypoint.deleteMany();
  await prisma.routeTrip.deleteMany();
  await prisma.partMaintenance.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.serviceMaintenance.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@escola.local",
      passwordHash,
      name: "Administrador",
      role: UserRole.ADMIN,
    },
  });

  // Alunos e mural
  const student1 = await prisma.student.create({
    data: {
      name: "Ana Beatriz",
      birthDate: new Date("2016-08-12"),
      guardianName: "Mariana Souza",
      guardianPhone: "(11) 98888-1234",
      notes: "Alergia leve a lactose.",
    },
  });
  await prisma.student.create({
    data: {
      name: "Lucas Henrique",
      birthDate: new Date("2015-03-03"),
      guardianName: "Paulo Henrique",
      guardianPhone: "(11) 97777-4321",
    },
  });
  const admin = await prisma.user.findUnique({ where: { email: "admin@escola.local" } });
  if (admin) {
    await prisma.announcement.createMany({
      data: [
        {
          title: "Bem-vindo ao painel",
          body: "Use o menu para cadastrar veículos, registrar manutenção e acompanhar rotas.",
          pinned: true,
          authorId: admin.id,
        },
        {
          title: "Comunicado",
          body: "Atualize a documentação dos veículos até o fim do mês.",
          pinned: false,
          authorId: admin.id,
        },
      ],
    });
  }

  const v1 = await prisma.vehicle.create({
    data: {
      plate: "MER-8A12",
      label: "Mercedes OF 1721",
      kind: VehicleKind.ONIBUS,
      capacity: 44,
      odometerKm: 187420,
      status: VehicleStatus.ATIVO,
      nextInspectionDate: new Date("2026-06-10"),
      driverName: "Carlos Almeida",
      schoolRouteName: "Centro → Jardim Europa",
    },
  });

  const v2 = await prisma.vehicle.create({
    data: {
      plate: "VOL-4B33",
      label: "Volare V8",
      kind: VehicleKind.MICROONIBUS,
      capacity: 26,
      odometerKm: 98200,
      status: VehicleStatus.ATIVO,
      nextInspectionDate: new Date("2026-05-22"),
      driverName: "Fernanda Rios",
      schoolRouteName: "Vila Mariana → Moema",
    },
  });

  const v3 = await prisma.vehicle.create({
    data: {
      plate: "REN-9C77",
      label: "Master L3H2",
      kind: VehicleKind.VAN,
      capacity: 16,
      odometerKm: 124300,
      status: VehicleStatus.MANUTENCAO,
      nextInspectionDate: new Date("2026-04-28"),
      driverName: "João Prado",
      schoolRouteName: "Pinheiros → Perdizes",
    },
  });

  const v4 = await prisma.vehicle.create({
    data: {
      plate: "FIA-2D55",
      label: "Ducato Escolar",
      kind: VehicleKind.UTILITARIO,
      capacity: 12,
      odometerKm: 67880,
      status: VehicleStatus.ATIVO,
      nextInspectionDate: new Date("2026-07-01"),
      driverName: "Marina Costa",
      schoolRouteName: "Butantã → USP",
    },
  });

  async function createTrip(
    vehicleId: string,
    routeName: string,
    startedAt: Date,
    endedAt: Date,
    distanceKm: number,
    stops: number,
    path: { lat: number; lng: number }[],
  ) {
    await prisma.routeTrip.create({
      data: {
        vehicleId,
        routeName,
        startedAt,
        endedAt,
        distanceKm,
        stops,
        waypoints: {
          create: path.map((p, orderIdx) => ({
            lat: p.lat,
            lng: p.lng,
            orderIdx,
          })),
        },
      },
    });
  }

  await createTrip(
    v1.id,
    "Centro → Jardim Europa (ida)",
    new Date("2026-04-22T06:45:00"),
    new Date("2026-04-22T08:05:00"),
    18.4,
    9,
    basePath,
  );

  await createTrip(
    v2.id,
    "Vila Mariana → Moema (ida)",
    new Date("2026-04-22T06:30:00"),
    new Date("2026-04-22T07:50:00"),
    12.1,
    6,
    basePath.map((p, i) => ({
      lat: p.lat + i * 0.0012,
      lng: p.lng - 0.02,
    })),
  );

  await createTrip(
    v4.id,
    "Butantã → USP (ida)",
    new Date("2026-04-21T06:15:00"),
    new Date("2026-04-21T07:25:00"),
    9.8,
    5,
    basePath.map((p) => ({
      lat: p.lat - 0.04,
      lng: p.lng + 0.015,
    })),
  );

  await prisma.partMaintenance.createMany({
    data: [
      {
        vehicleId: v1.id,
        date: new Date("2026-04-18"),
        description: "Troca preventiva",
        partName: "Pastilhas de freio dianteiras",
        costBrl: 890,
        odometerKm: 186900,
      },
      {
        vehicleId: v3.id,
        date: new Date("2026-04-10"),
        description: "Vazamento leve",
        partName: "Mangueira radiador",
        costBrl: 210,
        odometerKm: 124050,
      },
      {
        vehicleId: v2.id,
        date: new Date("2026-03-28"),
        description: "Desgaste irregular",
        partName: "Pneu traseiro esquerdo (195R14)",
        costBrl: 680,
        odometerKm: 97800,
      },
    ],
  });

  await prisma.fuelLog.createMany({
    data: [
      {
        vehicleId: v1.id,
        date: new Date("2026-04-21"),
        liters: 120,
        costBrl: 792,
        odometerKm: 187300,
        station: "Posto Rede Sul",
      },
      {
        vehicleId: v2.id,
        date: new Date("2026-04-20"),
        liters: 65,
        costBrl: 429,
        odometerKm: 98120,
      },
      {
        vehicleId: v4.id,
        date: new Date("2026-04-19"),
        liters: 48,
        costBrl: 316.8,
        odometerKm: 67750,
      },
    ],
  });

  await prisma.serviceMaintenance.createMany({
    data: [
      {
        vehicleId: v3.id,
        date: new Date("2026-04-22"),
        title: "Revisão geral + diagnóstico arrefecimento",
        notes: "Veículo retirado de rota até liberação.",
        costBrl: 1450,
        odometerKm: 124280,
      },
      {
        vehicleId: v1.id,
        date: new Date("2026-04-05"),
        title: "Alinhamento e balanceamento",
        costBrl: 180,
        odometerKm: 186200,
      },
      {
        vehicleId: v4.id,
        date: new Date("2026-03-15"),
        title: "Inspeção CIP / documentação",
        costBrl: 320,
        odometerKm: 67200,
      },
    ],
  });

  const now = new Date();
  await prisma.gpsPoint.createMany({
    data: [
      {
        vehicleId: v1.id,
        lat: basePath[0].lat,
        lng: basePath[0].lng,
        recordedAt: new Date(now.getTime() - 60 * 60 * 1000),
        source: "seed",
      },
      {
        vehicleId: v1.id,
        lat: basePath[3].lat,
        lng: basePath[3].lng,
        recordedAt: new Date(now.getTime() - 30 * 60 * 1000),
        source: "seed",
      },
    ],
  });

  // Financeiro: exemplos simples (receita mensalidade e despesa combustível)
  if (admin) {
    await prisma.financialEntry.createMany({
      data: [
        {
          type: "RECEITA",
          date: new Date("2026-04-05"),
          category: "Mensalidade",
          amountBrl: 220,
          notes: "Mensalidade — abril",
          studentId: student1.id,
          createdById: admin.id,
        },
        {
          type: "DESPESA",
          date: new Date("2026-04-21"),
          category: "Combustível",
          amountBrl: 792,
          notes: "Abastecimento",
          vehicleId: v1.id,
          createdById: admin.id,
        },
      ],
    });
  }

  console.log("Seed OK — usuário admin@escola.local / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
