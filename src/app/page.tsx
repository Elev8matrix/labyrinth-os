import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, GitBranch, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [contracts, requests, redTags, overdueRequests] = await Promise.all([
    db.contract.count(),
    db.request.count(),
    db.redTag.count({ where: { state: { in: ["OPEN", "ACKNOWLEDGED"] } } }),
    db.request.count({
      where: {
        state: { in: ["OPEN", "IN_PROGRESS"] },
        dueAt: { lt: new Date() },
      },
    }),
  ]);

  const recentContracts = await db.contract.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          requests: true,
          redTags: { where: { state: { in: ["OPEN", "ACKNOWLEDGED"] } } },
        },
      },
    },
  });

  const urgentRequests = await db.request.findMany({
    where: {
      state: { in: ["OPEN", "IN_PROGRESS"] },
      dueAt: { lt: new Date() },
    },
    take: 5,
    orderBy: { dueAt: "asc" },
    include: { contract: { select: { name: true } } },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Execution intelligence overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Contracts"
          value={contracts}
          icon={<FileText className="h-4 w-4" />}
          href="/contracts"
        />
        <StatCard
          title="Open Requests"
          value={requests}
          icon={<GitBranch className="h-4 w-4" />}
          href="/requests"
        />
        <StatCard
          title="Active Red Tags"
          value={redTags}
          icon={<AlertTriangle className="h-4 w-4" />}
          href="/red-tags"
          variant={redTags > 0 ? "destructive" : "default"}
        />
        <StatCard
          title="Overdue"
          value={overdueRequests}
          icon={<Clock className="h-4 w-4" />}
          variant={overdueRequests > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Contracts</CardTitle>
            <Link
              href="/contracts"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentContracts.length === 0 ? (
              <EmptyState
                message="No contracts yet"
                href="/contracts/new"
                cta="Create first contract"
              />
            ) : (
              <div className="space-y-3">
                {recentContracts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.clientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {c._count.requests} requests
                      </Badge>
                      {c._count.redTags > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {c._count.redTags} red tags
                        </Badge>
                      )}
                      <StageBadge stage={c.stage} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Overdue Requests</CardTitle>
            <Link
              href="/requests"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {urgentRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No overdue requests
              </div>
            ) : (
              <div className="space-y-3">
                {urgentRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div>
                      <p className="font-medium text-sm">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.contract.name}
                      </p>
                    </div>
                    <div className="text-xs text-destructive font-medium">
                      {getOverdueDays(r.dueAt)} overdue
                    </div>
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

function StatCard({
  title,
  value,
  icon,
  href,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
  variant?: "default" | "destructive" | "warning";
}) {
  const content = (
    <Card
      className={
        variant === "destructive"
          ? "border-destructive/50"
          : variant === "warning"
            ? "border-orange-500/50"
            : ""
      }
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div
            className={
              variant === "destructive"
                ? "text-destructive"
                : variant === "warning"
                  ? "text-orange-500"
                  : "text-muted-foreground"
            }
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
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
      {stage.replace("_", " ")}
    </span>
  );
}

function EmptyState({
  message,
  href,
  cta,
}: {
  message: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground text-sm mb-3">{message}</p>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {cta}
      </Link>
    </div>
  );
}

function getOverdueDays(dueAt: Date): string {
  const diff = Date.now() - new Date(dueAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Due today";
  if (days === 1) return "1 day";
  return `${days} days`;
}
