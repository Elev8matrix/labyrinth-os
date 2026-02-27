import { NextResponse } from "next/server";
import { runAccountabilityCheck } from "@/lib/accountability-engine";
import { logAudit } from "@/lib/audit";

export async function POST() {
  const result = await runAccountabilityCheck();

  await logAudit(null, "ACCOUNTABILITY_CHECK", "System", "accountability", {
    ...result,
  });

  return NextResponse.json(result);
}
