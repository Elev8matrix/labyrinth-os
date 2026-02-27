import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const decisions = await db.decision.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contract: { select: { id: true, name: true } },
      decidedBy: { select: { name: true } },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Decisions</h1>
        <p className="text-muted-foreground">
          Decision memory log — {decisions.length} recorded
        </p>
      </div>

      {decisions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No decisions recorded yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {decisions.map((d) => (
            <Card key={d.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{d.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {d.category}
                    </Badge>
                    <OutcomeBadge outcome={d.outcome} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {d.rationale}
                </p>
                {d.outcomeNotes && (
                  <p className="text-sm bg-muted/50 rounded p-2 mb-3">
                    {d.outcomeNotes}
                  </p>
                )}
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <Link
                    href={`/contracts/${d.contract.id}`}
                    className="hover:underline"
                  >
                    {d.contract.name}
                  </Link>
                  {d.decidedBy && <span>by {d.decidedBy.name}</span>}
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  <StatusBadge status={d.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const colors: Record<string, string> = {
    POSITIVE: "bg-green-100 text-green-700",
    NEUTRAL: "bg-gray-100 text-gray-700",
    NEGATIVE: "bg-red-100 text-red-700",
    PENDING: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[outcome] || ""}`}
    >
      {outcome}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "text-green-600",
    SUPERSEDED: "text-yellow-600",
    REVERSED: "text-red-600",
    ARCHIVED: "text-gray-500",
  };
  return (
    <span className={`font-medium ${colors[status] || ""}`}>{status}</span>
  );
}
