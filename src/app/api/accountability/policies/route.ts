import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const policies = await db.accountabilityPolicy.findMany({
    orderBy: { clientPackage: "asc" },
  });
  return NextResponse.json(policies);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  // Expect { clientPackage, reminderHours, warningHours, escalationHours }
  const policy = await db.accountabilityPolicy.upsert({
    where: { clientPackage: body.clientPackage },
    update: {
      reminderHours: body.reminderHours,
      warningHours: body.warningHours,
      escalationHours: body.escalationHours,
    },
    create: {
      clientPackage: body.clientPackage,
      reminderHours: body.reminderHours,
      warningHours: body.warningHours,
      escalationHours: body.escalationHours,
    },
  });

  return NextResponse.json(policy);
}
