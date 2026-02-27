import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">
            {contracts.length} contract{contracts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/contracts/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New Contract
        </Link>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No contracts yet. Create your first contract to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((c) => (
            <Link key={c.id} href={`/contracts/${c.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {c.clientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StageBadge stage={c.stage} />
                      <PackageBadge pkg={c.clientPackage} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{c._count.milestones} milestones</span>
                    <span>{c._count.requests} requests</span>
                    {c._count.redTags > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {c._count.redTags} red tag
                        {c._count.redTags !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    {c.value && (
                      <span className="ml-auto font-medium text-foreground">
                        ${Number(c.value).toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    PENDING_ACTIVATION: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-green-100 text-green-700",
    ON_HOLD: "bg-orange-100 text-orange-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[stage] || "bg-gray-100 text-gray-700"}`}
    >
      {stage.replace(/_/g, " ")}
    </span>
  );
}

function PackageBadge({ pkg }: { pkg: string }) {
  const colors: Record<string, string> = {
    BRONZE: "bg-amber-100 text-amber-800",
    SILVER: "bg-slate-100 text-slate-700",
    GOLD: "bg-yellow-100 text-yellow-800",
    BLACK: "bg-gray-900 text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[pkg] || "bg-gray-100 text-gray-700"}`}
    >
      {pkg}
    </span>
  );
}
