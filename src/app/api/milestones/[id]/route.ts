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
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) data.status = body.status;
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

  const milestone = await db.milestone.update({ where: { id }, data });

  await logAudit(null, "UPDATE", "Milestone", id, { changes: Object.keys(data) });

  return NextResponse.json(milestone);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.milestone.delete({ where: { id } });
  await logAudit(null, "DELETE", "Milestone", id);
  return NextResponse.json({ success: true });
}
