import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await db.request.findUnique({
    where: { id },
    include: {
      contract: { select: { id: true, name: true, clientName: true, clientPackage: true } },
      owner: { select: { id: true, name: true, email: true } },
      milestone: { select: { id: true, title: true } },
      assignments: { include: { user: { select: { id: true, name: true } } } },
      redTags: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      accountabilityEvents: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!request) notFound();

  const isOverdue =
    request.state !== "COMPLETED" &&
    request.state !== "CANCELLED" &&
    new Date(request.dueAt) < new Date();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <Link
          href="/requests"
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block transition-colors"
        >
          &larr; All requests
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Link
                href={`/contracts/${request.contract.id}`}
                className="hover:underline hover:text-foreground transition-colors"
              >
                {request.contract.name}
              </Link>
              {request.milestone && (
                <>
                  <span>&middot;</span>
                  <span>{request.milestone.title}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge type="state" value={request.state} />
            <StatusBadge type="priority" value={request.priority} />
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Owner</p>
            <p className="font-medium">{request.owner.name}</p>
            <p className="text-xs text-muted-foreground">{request.owner.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className={`font-medium ${isOverdue ? "text-destructive" : ""}`}>
              {new Date(request.dueAt).toLocaleDateString()}
              {isOverdue && <span className="text-xs ml-1">(overdue)</span>}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tag</p>
            <Badge variant="outline" className="mt-1">
              {request.tag.replace(/_/g, " ")}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {request.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{request.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Blocking status */}
      {request.blockedByRedTagId && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">
              This request is blocked by a red tag
            </p>
          </CardContent>
        </Card>
      )}

      {/* Escalation level */}
      {request.escalationLevel !== "NONE" && (
        <Card className="border-orange-500/30 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-orange-700">
              Escalation Level: {request.escalationLevel}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Red Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Red Tags ({request.redTags.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {request.redTags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No red tags</p>
            ) : (
              <div className="space-y-3">
                {request.redTags.map((rt) => (
                  <div
                    key={rt.id}
                    className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge type="severity" value={rt.severity} />
                      <StatusBadge type="redTagState" value={rt.state} />
                    </div>
                    <p className="text-sm font-medium">{rt.title}</p>
                    {rt.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {rt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accountability Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Accountability Timeline ({request.accountabilityEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {request.accountabilityEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No escalation events</p>
            ) : (
              <div className="space-y-3">
                {request.accountabilityEvents.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{e.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
