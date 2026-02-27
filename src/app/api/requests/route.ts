import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateGoldenRule } from "@/lib/golden-rule";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const tag = searchParams.get("tag");
  const contractId = searchParams.get("contractId");

  const where: Record<string, unknown> = {};
  if (state) where.state = state;
  if (tag) where.tag = tag;
  if (contractId) where.contractId = contractId;

  const requests = await db.request.findMany({
    where,
    orderBy: { dueAt: "asc" },
    include: {
      contract: { select: { id: true, name: true, clientName: true } },
      owner: { select: { id: true, name: true } },
      milestone: { select: { id: true, title: true } },
    },
  });
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Golden Rule enforcement
  const { valid, violations } = validateGoldenRule(body);
  if (!valid) {
    return NextResponse.json(
      { error: "GoldenRuleViolation", violations },
      { status: 422 }
    );
  }

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
      createdById: body.createdById || null,
    },
  });

  await logAudit(
    body.createdById || null,
    "CREATE",
    "Request",
    request.id,
    { title: request.title, tag: request.tag, contractId: request.contractId }
  );

  return NextResponse.json(request, { status: 201 });
}
