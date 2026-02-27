import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RedTagsPage() {
  const redTags = await db.redTag.findMany({
    orderBy: [{ state: "asc" }, { severity: "desc" }, { createdAt: "desc" }],
    include: {
      contract: { select: { id: true, name: true } },
      milestone: { select: { id: true, title: true } },
      request: { select: { id: true, title: true } },
      createdBy: { select: { name: true } },
    },
  });

  const openCount = redTags.filter(
    (rt) => rt.state === "OPEN" || rt.state === "ACKNOWLEDGED"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Red Tags</h1>
        <p className="text-muted-foreground">
          {openCount} active &middot; {redTags.length} total
        </p>
      </div>

      {redTags.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No red tags. Everything is clear.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {redTags.map((rt) => {
            const isActive =
              rt.state === "OPEN" || rt.state === "ACKNOWLEDGED";
            return (
              <Card
                key={rt.id}
                className={
                  isActive
                    ? "border-destructive/30 bg-destructive/5"
                    : "opacity-60"
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={rt.severity} />
                        <span className="font-medium">{rt.title}</span>
                      </div>
                      {rt.description && (
                        <p className="text-sm text-muted-foreground">
                          {rt.description}
                        </p>
                      )}
                      <div className="flex gap-3 text-xs text-muted-foreground pt-1">
                        <Link
                          href={`/contracts/${rt.contract.id}`}
                          className="hover:underline"
                        >
                          {rt.contract.name}
                        </Link>
                        {rt.milestone && (
                          <span>&middot; {rt.milestone.title}</span>
                        )}
                        {rt.request && (
                          <span>&middot; {rt.request.title}</span>
                        )}
                        {rt.createdBy && (
                          <span>&middot; by {rt.createdBy.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RedTagStateBadge state={rt.state} />
                    </div>
                  </div>
                  {rt.resolutionNotes && (
                    <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded p-2">
                      Resolution: {rt.resolutionNotes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    WARNING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    CRITICAL: "bg-orange-100 text-orange-800 border-orange-300",
    BLOCKER: "bg-red-100 text-red-800 border-red-300",
  };
  const scope: Record<string, string> = {
    WARNING: "Blocks request",
    CRITICAL: "Blocks milestone",
    BLOCKER: "Blocks contract",
  };
  return (
    <span
      title={scope[severity]}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${colors[severity] || ""}`}
    >
      {severity}
    </span>
  );
}

function RedTagStateBadge({ state }: { state: string }) {
  const colors: Record<string, string> = {
    OPEN: "bg-red-100 text-red-700",
    ACKNOWLEDGED: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    DISMISSED: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[state] || ""}`}
    >
      {state}
    </span>
  );
}
