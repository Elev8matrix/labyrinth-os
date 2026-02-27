import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const events = await db.accountabilityEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      request: {
        select: {
          id: true,
          title: true,
          state: true,
          dueAt: true,
          owner: { select: { id: true, name: true } },
          contract: { select: { id: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json(events);
}
