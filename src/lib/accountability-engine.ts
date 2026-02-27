import { db } from "@/lib/db";
import type { EscalationLevel } from "@/generated/prisma/client";

/**
 * Accountability Loop Engine
 *
 * Runs periodic checks on open/in-progress requests and escalates
 * based on the contract's client package policy.
 *
 * Timeline:  reminderAt → dueAt → warningAt → escalateAt
 *   NONE → REMINDER   when now >= (dueAt - reminderHours)
 *   REMINDER → WARNING when now >= (dueAt + warningHours)
 *   WARNING → ESCALATED when now >= (dueAt + escalationHours)
 */

interface CheckResult {
  reminders: number;
  warnings: number;
  escalations: number;
  processed: number;
}

export async function runAccountabilityCheck(): Promise<CheckResult> {
  const now = new Date();
  const result: CheckResult = { reminders: 0, warnings: 0, escalations: 0, processed: 0 };

  // Fetch all active requests with due dates
  const requests = await db.request.findMany({
    where: {
      state: { in: ["OPEN", "IN_PROGRESS"] },
      dueAt: { not: undefined },
    },
    include: {
      contract: { select: { clientPackage: true } },
    },
  });

  // Fetch all policies (keyed by package)
  const policies = await db.accountabilityPolicy.findMany();
  const policyMap = new Map(policies.map((p) => [p.clientPackage, p]));

  for (const request of requests) {
    const policy = policyMap.get(request.contract.clientPackage);
    if (!policy) continue;

    result.processed++;

    const dueAt = new Date(request.dueAt).getTime();
    const nowMs = now.getTime();
    const hour = 3600000;

    const reminderAt = dueAt - policy.reminderHours * hour;
    const warningAt = dueAt + policy.warningHours * hour;
    const escalateAt = dueAt + policy.escalationHours * hour;

    let newLevel: EscalationLevel | null = null;
    let eventType: "REMINDER" | "WARNING" | "ESCALATION" | null = null;
    let message = "";

    if (request.escalationLevel === "NONE" && nowMs >= reminderAt) {
      newLevel = "REMINDER";
      eventType = "REMINDER";
      message = `Reminder: "${request.title}" is due soon`;
      result.reminders++;
    } else if (request.escalationLevel === "REMINDER" && nowMs >= warningAt) {
      newLevel = "WARNING";
      eventType = "WARNING";
      message = `Warning: "${request.title}" is now due or overdue`;
      result.warnings++;
    } else if (request.escalationLevel === "WARNING" && nowMs >= escalateAt) {
      newLevel = "ESCALATED";
      eventType = "ESCALATION";
      message = `Escalated: "${request.title}" has exceeded the escalation threshold`;
      result.escalations++;
    }

    if (newLevel && eventType) {
      await db.$transaction([
        db.request.update({
          where: { id: request.id },
          data: { escalationLevel: newLevel },
        }),
        db.accountabilityEvent.create({
          data: {
            requestId: request.id,
            type: eventType,
            fromLevel: request.escalationLevel,
            toLevel: newLevel,
            message,
          },
        }),
      ]);
    }
  }

  return result;
}
