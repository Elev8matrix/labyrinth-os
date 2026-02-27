import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { applyBlocking, removeBlocking } from "@/lib/red-tag-engine";
import { logAudit } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redTag = await db.redTag.findUnique({
    where: { id },
    include: {
      contract: { select: { id: true, name: true } },
      milestone: { select: { id: true, title: true } },
      request: { select: { id: true, title: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  if (!redTag) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(redTag);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.state !== undefined) data.state = body.state;
  if (body.resolutionNotes !== undefined) data.resolutionNotes = body.resolutionNotes;

  if (body.state === "RESOLVED" || body.state === "DISMISSED") {
    data.resolvedAt = new Date();
    data.resolvedById = body.resolvedById || null;
  }

  const redTag = await db.redTag.update({ where: { id }, data });

  // Handle blocking state changes
  if (body.state === "RESOLVED" || body.state === "DISMISSED") {
    await removeBlocking(id);
  } else if (body.state === "OPEN") {
    await applyBlocking(id);
  }

  await logAudit(body.resolvedById || null, "UPDATE", "RedTag", id, {
    state: body.state,
  });

  return NextResponse.json(redTag);
}
