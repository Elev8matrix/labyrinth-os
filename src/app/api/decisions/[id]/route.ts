import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.outcome !== undefined) data.outcome = body.outcome;
  if (body.outcomeNotes !== undefined) data.outcomeNotes = body.outcomeNotes;
  if (body.title !== undefined) data.title = body.title;
  if (body.rationale !== undefined) data.rationale = body.rationale;

  const decision = await db.decision.update({ where: { id }, data });

  await logAudit(null, "UPDATE", "Decision", id, { changes: Object.keys(data) });

  return NextResponse.json(decision);
}
