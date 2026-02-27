import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const decisions = await db.decision.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contract: { select: { id: true, name: true } },
      decidedBy: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(decisions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const decision = await db.decision.create({
    data: {
      contractId: body.contractId,
      title: body.title,
      rationale: body.rationale,
      category: body.category || "OPERATIONAL",
      status: body.status || "ACTIVE",
      outcome: body.outcome || "PENDING",
      decidedById: body.decidedById || null,
    },
  });

  await logAudit(body.decidedById || null, "CREATE", "Decision", decision.id, {
    title: decision.title,
    category: decision.category,
  });

  return NextResponse.json(decision, { status: 201 });
}
