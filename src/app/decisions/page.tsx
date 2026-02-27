import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
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
            <Card key={d.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{d.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {d.category}
                    </Badge>
                    <StatusBadge type="outcome" value={d.outcome} />
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
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Link
                    href={`/contracts/${d.contract.id}`}
                    className="hover:underline transition-colors hover:text-foreground"
                  >
                    {d.contract.name}
                  </Link>
                  {d.decidedBy && <span>by {d.decidedBy.name}</span>}
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  <StatusBadge type="decisionStatus" value={d.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
