import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await db.contract.findUnique({
    where: { id },
    include: {
      milestones: {
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { requests: true } },
        },
      },
      requests: {
        orderBy: { dueAt: "asc" },
        include: { owner: { select: { id: true, name: true } } },
      },
      redTags: {
        where: { state: { in: ["OPEN", "ACKNOWLEDGED"] } },
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      decisions: {
        orderBy: { createdAt: "desc" },
        include: { decidedBy: { select: { name: true } } },
      },
    },
  });

  if (!contract) notFound();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/contracts"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            &larr; All contracts
          </Link>
          <h1 className="text-2xl font-bold">{contract.name}</h1>
          <p className="text-muted-foreground">{contract.clientName}</p>
        </div>
        <div className="flex gap-2">
          <StageBadge stage={contract.stage} />
          <PackageBadge pkg={contract.clientPackage} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm">
        {contract.value && (
          <span className="font-medium">
            ${Number(contract.value).toLocaleString()}
          </span>
        )}
        {contract.startDate && (
          <span className="text-muted-foreground">
            Started {new Date(contract.startDate).toLocaleDateString()}
          </span>
        )}
        {contract.endDate && (
          <span className="text-muted-foreground">
            Ends {new Date(contract.endDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {contract.notes && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          {contract.notes}
        </p>
      )}

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Milestones ({contract.milestones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contract.milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No milestones yet
              </p>
            ) : (
              <div className="space-y-3">
                {contract.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium text-sm">{m.title}</p>
                      {m.dueDate && (
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(m.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {m._count.requests} req
                      </span>
                      <MilestoneStatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Red Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Active Red Tags ({contract.redTags.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contract.redTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active red tags
              </p>
            ) : (
              <div className="space-y-3">
                {contract.redTags.map((rt) => (
                  <div
                    key={rt.id}
                    className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={rt.severity} />
                      <span className="font-medium text-sm">{rt.title}</span>
                    </div>
                    {rt.description && (
                      <p className="text-xs text-muted-foreground">
                        {rt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Requests ({contract.requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contract.requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No requests yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Tag</th>
                    <th className="pb-2 font-medium">Priority</th>
                    <th className="pb-2 font-medium">State</th>
                    <th className="pb-2 font-medium">Owner</th>
                    <th className="pb-2 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.requests.map((r) => {
                    const isOverdue =
                      r.state !== "COMPLETED" &&
                      r.state !== "CANCELLED" &&
                      new Date(r.dueAt) < new Date();
                    return (
                      <tr
                        key={r.id}
                        className={`border-b last:border-0 ${isOverdue ? "bg-destructive/5" : ""}`}
                      >
                        <td className="py-2 font-medium">{r.title}</td>
                        <td className="py-2">
                          <Badge variant="outline" className="text-xs">
                            {r.tag.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <PriorityBadge priority={r.priority} />
                        </td>
                        <td className="py-2">
                          <StateBadge state={r.state} />
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {r.owner.name}
                        </td>
                        <td
                          className={`py-2 ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
                        >
                          {new Date(r.dueAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decisions */}
      {contract.decisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Decisions ({contract.decisions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contract.decisions.map((d) => (
                <div key={d.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{d.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {d.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d.rationale}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {d.decidedBy?.name ?? "Unknown"} &middot;{" "}
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

function MilestoneStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NOT_STARTED: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    ON_HOLD: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    WARNING: "bg-yellow-100 text-yellow-800",
    CRITICAL: "bg-orange-100 text-orange-800",
    BLOCKER: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${colors[severity] || "bg-gray-100 text-gray-700"}`}
    >
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "text-gray-500",
    NORMAL: "text-foreground",
    HIGH: "text-orange-600 font-medium",
    URGENT: "text-red-600 font-bold",
  };
  return <span className={`text-xs ${colors[priority] || ""}`}>{priority}</span>;
}

function StateBadge({ state }: { state: string }) {
  const colors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    BLOCKED: "bg-red-100 text-red-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[state] || "bg-gray-100 text-gray-700"}`}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}
