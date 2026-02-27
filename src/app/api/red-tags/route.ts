import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { applyBlocking } from "@/lib/red-tag-engine";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const redTags = await db.redTag.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contract: { select: { id: true, name: true } },
      milestone: { select: { id: true, title: true } },
      request: { select: { id: true, title: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(redTags);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const redTag = await db.redTag.create({
    data: {
      contractId: body.contractId,
      milestoneId: body.milestoneId || null,
      requestId: body.requestId || null,
      severity: body.severity,
      title: body.title,
      description: body.description || null,
      createdById: body.createdById || null,
    },
  });

  // Apply blocking based on severity
  await applyBlocking(redTag.id);

  await logAudit(body.createdById || null, "CREATE", "RedTag", redTag.id, {
    title: redTag.title,
    severity: redTag.severity,
    contractId: redTag.contractId,
  });

  return NextResponse.json(redTag, { status: 201 });
}
