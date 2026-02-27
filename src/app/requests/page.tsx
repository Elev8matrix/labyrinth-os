import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div>
        <h1 className="text-2xl font-bold">Requests</h1>
        <p className="text-muted-foreground">
          {requests.length} request{requests.length !== 1 ? "s" : ""} across all
          contracts
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No requests yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Contract</th>
                    <th className="pb-2 font-medium">Tag</th>
                    <th className="pb-2 font-medium">Priority</th>
                    <th className="pb-2 font-medium">State</th>
                    <th className="pb-2 font-medium">Owner</th>
                    <th className="pb-2 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => {
                    const isOverdue =
                      r.state !== "COMPLETED" &&
                      r.state !== "CANCELLED" &&
                      new Date(r.dueAt) < now;
                    return (
                      <tr
                        key={r.id}
                        className={`border-b last:border-0 ${isOverdue ? "bg-destructive/5" : ""}`}
                      >
                        <td className="py-3 font-medium">{r.title}</td>
                        <td className="py-3 text-muted-foreground">
                          {r.contract.name}
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs">
                            {r.tag.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <PriorityBadge priority={r.priority} />
                        </td>
                        <td className="py-3">
                          <StateBadge state={r.state} />
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {r.owner.name}
                        </td>
                        <td
                          className={`py-3 ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
                        >
                          {new Date(r.dueAt).toLocaleDateString()}
                          {isOverdue && (
                            <span className="ml-1 text-xs">(overdue)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
