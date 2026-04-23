"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { announcementCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createAnnouncement(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on",
  };
  const parsed = announcementCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const row = await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      pinned: !!parsed.data.pinned,
      authorId: session.user.id,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "announcement.create",
    entity: "Announcement",
    entityId: row.id,
  });

  revalidatePath("/mural");
  return { ok: true, message: "Aviso publicado." };
}

