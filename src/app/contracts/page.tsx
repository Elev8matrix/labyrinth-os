import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
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
        <Button asChild>
          <Link href="/contracts/new">New Contract</Link>
        </Button>
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
                      <StatusBadge type="stage" value={c.stage} />
                      <StatusBadge type="package" value={c.clientPackage} />
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
