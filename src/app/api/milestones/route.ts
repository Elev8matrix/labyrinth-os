import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const milestone = await db.milestone.create({
    data: {
      contractId: body.contractId,
      title: body.title,
      description: body.description || null,
      status: body.status || "NOT_STARTED",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      sortOrder: body.sortOrder || 0,
    },
  });

  await logAudit(null, "CREATE", "Milestone", milestone.id, {
    title: milestone.title,
    contractId: milestone.contractId,
  });

  return NextResponse.json(milestone, { status: 201 });
}
