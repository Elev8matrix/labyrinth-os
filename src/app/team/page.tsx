import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          ownedRequests: { where: { state: { in: ["OPEN", "IN_PROGRESS"] } } },
          assignments: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          {users.length} member{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No team members yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Card key={u.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <StatusBadge type="role" value={u.role} />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{u._count.ownedRequests} active requests</span>
                  <span>{u._count.assignments} assignments</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
