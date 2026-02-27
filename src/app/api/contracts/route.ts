import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const contracts = await db.contract.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          requests: true,
          milestones: true,
          redTags: { where: { state: { in: ["OPEN", "ACKNOWLEDGED"] } } },
        },
      },
    },
  });
  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contract = await db.contract.create({
    data: {
      name: body.name,
      clientName: body.clientName,
      clientPackage: body.clientPackage || "SILVER",
      stage: body.stage || "DRAFT",
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      value: body.value || null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(contract, { status: 201 });
}
