import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
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
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block transition-colors"
          >
            &larr; All contracts
          </Link>
          <h1 className="text-2xl font-bold">{contract.name}</h1>
          <p className="text-muted-foreground">{contract.clientName}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge type="stage" value={contract.stage} />
          <StatusBadge type="package" value={contract.clientPackage} />
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
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
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
                      <StatusBadge type="milestone" value={m.status} />
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
                      <StatusBadge type="severity" value={rt.severity} />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.requests.map((r) => {
                  const isOverdue =
                    r.state !== "COMPLETED" &&
                    r.state !== "CANCELLED" &&
                    new Date(r.dueAt) < new Date();
                  return (
                    <TableRow
                      key={r.id}
                      className={isOverdue ? "bg-destructive/5" : ""}
                    >
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {r.tag.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge type="priority" value={r.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge type="state" value={r.state} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.owner.name}
                      </TableCell>
                      <TableCell
                        className={
                          isOverdue
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {new Date(r.dueAt).toLocaleDateString()}
                        {isOverdue && (
                          <span className="ml-1 text-xs">(overdue)</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
                <div
                  key={d.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
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
