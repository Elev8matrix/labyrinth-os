import { db } from "@/lib/db";

/**
 * Red-Tag Blocking Engine
 *
 * Severity-based blast radius:
 *   WARNING  → blocks the linked request only
 *   CRITICAL → blocks all requests under the linked milestone
 *   BLOCKER  → blocks all requests under the contract
 */

/** When a red tag is created or re-opened, block affected requests. */
export async function applyBlocking(redTagId: string) {
  const redTag = await db.redTag.findUnique({
    where: { id: redTagId },
    select: { id: true, severity: true, contractId: true, milestoneId: true, requestId: true },
  });
  if (!redTag) return;

  const where = buildBlockingWhere(redTag);
  if (!where) return;

  await db.request.updateMany({
    where: {
      ...where,
      state: { in: ["OPEN", "IN_PROGRESS"] },
    },
    data: {
      state: "BLOCKED",
      blockedByRedTagId: redTag.id,
    },
  });
}

/** When a red tag is resolved or dismissed, unblock requests it blocked. */
export async function removeBlocking(redTagId: string) {
  await db.request.updateMany({
    where: { blockedByRedTagId: redTagId },
    data: {
      state: "OPEN",
      blockedByRedTagId: null,
    },
  });
}

/** Check if a request is currently blocked by any active red tag. */
export async function isRequestBlocked(requestId: string): Promise<boolean> {
  const request = await db.request.findUnique({
    where: { id: requestId },
    select: { blockedByRedTagId: true, state: true },
  });
  return request?.state === "BLOCKED" && !!request.blockedByRedTagId;
}

function buildBlockingWhere(redTag: {
  severity: string;
  contractId: string;
  milestoneId: string | null;
  requestId: string | null;
}): Record<string, unknown> | null {
  switch (redTag.severity) {
    case "WARNING":
      // Block only the specific request
      if (redTag.requestId) return { id: redTag.requestId };
      if (redTag.milestoneId) return { milestoneId: redTag.milestoneId };
      return null;
    case "CRITICAL":
      // Block all requests in the milestone
      if (redTag.milestoneId) return { milestoneId: redTag.milestoneId };
      return { contractId: redTag.contractId };
    case "BLOCKER":
      // Block ALL requests in the contract
      return { contractId: redTag.contractId };
    default:
      return null;
  }
}
