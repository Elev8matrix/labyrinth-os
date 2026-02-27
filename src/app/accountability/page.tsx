import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { RunCheckButton } from "./run-check-button";

export const dynamic = "force-dynamic";

export default async function AccountabilityPage() {
  const [events, overdueRequests] = await Promise.all([
    db.accountabilityEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        request: {
          select: {
            id: true,
            title: true,
            state: true,
            dueAt: true,
            escalationLevel: true,
            owner: { select: { id: true, name: true } },
            contract: { select: { id: true, name: true } },
          },
        },
      },
    }),
    db.request.findMany({
      where: {
        state: { in: ["OPEN", "IN_PROGRESS"] },
        dueAt: { lt: new Date() },
      },
      orderBy: { dueAt: "asc" },
      include: {
        owner: { select: { name: true } },
        contract: { select: { id: true, name: true } },
      },
    }),
  ]);

  const escalations = events.filter((e) => e.type === "ESCALATION");
  const warnings = events.filter((e) => e.type === "WARNING");
  const reminders = events.filter((e) => e.type === "REMINDER");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accountability</h1>
          <p className="text-muted-foreground">
            {overdueRequests.length} overdue &middot; {escalations.length} escalations
          </p>
        </div>
        <RunCheckButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={escalations.length > 0 ? "border-red-500/50" : ""}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Escalations</p>
            <p className="text-3xl font-bold text-red-600">{escalations.length}</p>
          </CardContent>
        </Card>
        <Card className={warnings.length > 0 ? "border-orange-500/50" : ""}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-3xl font-bold text-orange-600">{warnings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Reminders</p>
            <p className="text-3xl font-bold text-blue-600">{reminders.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Overdue Requests ({overdueRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overdueRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No overdue requests
            </p>
          ) : (
            <div className="space-y-3">
              {overdueRequests.map((r) => {
                const days = Math.floor(
                  (Date.now() - new Date(r.dueAt).getTime()) / 86400000
                );
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div>
                      <Link
                        href={`/requests/${r.id}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {r.title}
                      </Link>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                        <Link
                          href={`/contracts/${r.contract.id}`}
                          className="hover:underline"
                        >
                          {r.contract.name}
                        </Link>
                        <span>&middot; {r.owner.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="state" value={r.escalationLevel} />
                      <span className="text-xs text-destructive font-medium">
                        {days === 0 ? "Due today" : `${days}d overdue`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No accountability events yet. Run a check to scan for overdue items.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          e.type === "ESCALATION"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : e.type === "WARNING"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {e.type}
                      </Badge>
                      <Link
                        href={`/requests/${e.request.id}`}
                        className="font-medium hover:underline"
                      >
                        {e.request.title}
                      </Link>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{e.message}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span>{e.request.contract.name}</span>
                    <span>&middot; {e.request.owner.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
