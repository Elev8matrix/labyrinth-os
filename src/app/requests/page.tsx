import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await db.request.findMany({
    orderBy: { dueAt: "asc" },
    include: {
      contract: { select: { id: true, name: true, clientName: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  const now = new Date();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-muted-foreground">
            {requests.length} request{requests.length !== 1 ? "s" : ""} across all
            contracts
          </p>
        </div>
        <Button asChild>
          <Link href="/requests/new">New Request</Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No requests yet.{" "}
            <Link href="/requests/new" className="text-primary hover:underline">
              Create one
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => {
                  const isOverdue =
                    r.state !== "COMPLETED" &&
                    r.state !== "CANCELLED" &&
                    new Date(r.dueAt) < now;
                  return (
                    <TableRow
                      key={r.id}
                      className={isOverdue ? "bg-destructive/5" : ""}
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/requests/${r.id}`}
                          className="hover:underline hover:text-primary transition-colors"
                        >
                          {r.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Link
                          href={`/contracts/${r.contract.id}`}
                          className="hover:underline hover:text-foreground transition-colors"
                        >
                          {r.contract.name}
                        </Link>
                      </TableCell>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
