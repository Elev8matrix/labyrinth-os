import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { isRequestBlocked } from "@/lib/red-tag-engine";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const request = await db.request.findUnique({
    where: { id },
    include: {
      contract: { select: { id: true, name: true, clientName: true, clientPackage: true } },
      owner: { select: { id: true, name: true, email: true } },
      milestone: { select: { id: true, title: true } },
      assignments: { include: { user: { select: { id: true, name: true } } } },
      redTags: { orderBy: { createdAt: "desc" } },
      accountabilityEvents: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(request);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // If trying to move to IN_PROGRESS, check if blocked
  if (body.state === "IN_PROGRESS") {
    const blocked = await isRequestBlocked(id);
    if (blocked) {
      return NextResponse.json(
        { error: "Request is blocked by a red tag and cannot be started" },
        { status: 409 }
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.tag !== undefined) data.tag = body.tag;
  if (body.priority !== undefined) data.priority = body.priority;
  if (body.state !== undefined) data.state = body.state;
  if (body.ownerId !== undefined) data.ownerId = body.ownerId;
  if (body.milestoneId !== undefined) data.milestoneId = body.milestoneId || null;
  if (body.dueAt !== undefined) data.dueAt = new Date(body.dueAt);
  if (body.state === "IN_PROGRESS" && !body.startedAt) data.startedAt = new Date();
  if (body.state === "COMPLETED") data.completedAt = new Date();

  const request = await db.request.update({ where: { id }, data });

  await logAudit(body.updatedById || null, "UPDATE", "Request", id, {
    changes: Object.keys(data),
  });

  return NextResponse.json(request);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.request.delete({ where: { id } });
  await logAudit(null, "DELETE", "Request", id);
  return NextResponse.json({ success: true });
}
