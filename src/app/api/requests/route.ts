import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const tag = searchParams.get("tag");

  const where: Record<string, unknown> = {};
  if (state) where.state = state;
  if (tag) where.tag = tag;

  const requests = await db.request.findMany({
    where,
    orderBy: { dueAt: "asc" },
    include: {
      contract: { select: { id: true, name: true, clientName: true } },
      owner: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const request = await db.request.create({
    data: {
      contractId: body.contractId,
      milestoneId: body.milestoneId || null,
      title: body.title,
      description: body.description || null,
      tag: body.tag,
      priority: body.priority || "NORMAL",
      ownerId: body.ownerId,
      dueAt: new Date(body.dueAt),
    },
  });
  return NextResponse.json(request, { status: 201 });
}
