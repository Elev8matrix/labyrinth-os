import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
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
                        <StatusBadge type="severity" value={rt.severity} />
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
                          className="hover:underline transition-colors hover:text-foreground"
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
                    <StatusBadge type="redTagState" value={rt.state} />
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
