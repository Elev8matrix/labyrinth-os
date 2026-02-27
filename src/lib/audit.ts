import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export async function logAudit(
  userId: string | null,
  action: string,
  entity: string,
  entityId: string,
  details?: Record<string, unknown>
) {
  await db.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details: (details as Prisma.InputJsonValue) ?? undefined,
    },
  });
}
