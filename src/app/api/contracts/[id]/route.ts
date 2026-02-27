import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contract = await db.contract.findUnique({
    where: { id },
    include: {
      milestones: { orderBy: { sortOrder: "asc" } },
      requests: {
        orderBy: { dueAt: "asc" },
        include: { owner: { select: { id: true, name: true } } },
      },
      redTags: { orderBy: { createdAt: "desc" } },
      decisions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }
  return NextResponse.json(contract);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.clientName !== undefined) data.clientName = body.clientName;
  if (body.clientPackage !== undefined) data.clientPackage = body.clientPackage;
  if (body.stage !== undefined) data.stage = body.stage;
  if (body.startDate !== undefined)
    data.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.endDate !== undefined)
    data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.value !== undefined) data.value = body.value;
  if (body.notes !== undefined) data.notes = body.notes;

  const contract = await db.contract.update({ where: { id }, data });
  return NextResponse.json(contract);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.contract.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
