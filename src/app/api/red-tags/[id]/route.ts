import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.state !== undefined) data.state = body.state;
  if (body.resolutionNotes !== undefined)
    data.resolutionNotes = body.resolutionNotes;
  if (body.state === "RESOLVED") {
    data.resolvedAt = new Date();
    data.resolvedById = body.resolvedById || null;
  }

  const redTag = await db.redTag.update({ where: { id }, data });
  return NextResponse.json(redTag);
}
