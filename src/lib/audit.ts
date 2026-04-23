import { prisma } from "./prisma";

export async function writeAuditLog(input: {
  actorId: string;
  action: string;
  entity?: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  } catch (e) {
    // Logging não pode derrubar a ação principal
    console.error("[audit] falha ao gravar log", e);
  }
}

