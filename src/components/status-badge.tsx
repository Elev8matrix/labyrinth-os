import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONFIG: Record<string, Record<string, { className: string; label?: string }>> = {
  stage: {
    DRAFT: { className: "bg-gray-100 text-gray-700 border-gray-200" },
    PENDING_ACTIVATION: { className: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "PENDING" },
    ACTIVE: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ON_HOLD: { className: "bg-orange-50 text-orange-700 border-orange-200", label: "ON HOLD" },
    COMPLETED: { className: "bg-blue-50 text-blue-700 border-blue-200" },
    CANCELLED: { className: "bg-red-50 text-red-600 border-red-200" },
  },
  package: {
    BRONZE: { className: "bg-amber-50 text-amber-800 border-amber-200" },
    SILVER: { className: "bg-slate-100 text-slate-700 border-slate-200" },
    GOLD: { className: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    BLACK: { className: "bg-gray-900 text-white border-gray-900" },
  },
  milestone: {
    NOT_STARTED: { className: "bg-gray-100 text-gray-600 border-gray-200", label: "NOT STARTED" },
    IN_PROGRESS: { className: "bg-blue-50 text-blue-700 border-blue-200", label: "IN PROGRESS" },
    COMPLETED: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ON_HOLD: { className: "bg-orange-50 text-orange-700 border-orange-200", label: "ON HOLD" },
  },
  severity: {
    WARNING: { className: "bg-yellow-100 text-yellow-800 border-yellow-300 font-bold" },
    CRITICAL: { className: "bg-orange-100 text-orange-800 border-orange-300 font-bold" },
    BLOCKER: { className: "bg-red-100 text-red-800 border-red-300 font-bold" },
  },
  priority: {
    LOW: { className: "bg-slate-50 text-slate-500 border-slate-200" },
    NORMAL: { className: "bg-blue-50 text-blue-600 border-blue-200" },
    HIGH: { className: "bg-orange-50 text-orange-700 border-orange-200" },
    URGENT: { className: "bg-red-50 text-red-700 border-red-200 font-bold" },
  },
  state: {
    OPEN: { className: "bg-blue-50 text-blue-700 border-blue-200" },
    IN_PROGRESS: { className: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "IN PROGRESS" },
    BLOCKED: { className: "bg-red-50 text-red-700 border-red-200" },
    COMPLETED: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { className: "bg-gray-100 text-gray-500 border-gray-200" },
  },
  redTagState: {
    OPEN: { className: "bg-red-50 text-red-700 border-red-200" },
    ACKNOWLEDGED: { className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    RESOLVED: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    DISMISSED: { className: "bg-gray-100 text-gray-500 border-gray-200" },
  },
  outcome: {
    POSITIVE: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    NEUTRAL: { className: "bg-gray-100 text-gray-600 border-gray-200" },
    NEGATIVE: { className: "bg-red-50 text-red-700 border-red-200" },
    PENDING: { className: "bg-blue-50 text-blue-600 border-blue-200" },
  },
  decisionStatus: {
    ACTIVE: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    SUPERSEDED: { className: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    REVERSED: { className: "bg-red-50 text-red-600 border-red-200" },
    ARCHIVED: { className: "bg-gray-100 text-gray-500 border-gray-200" },
  },
  role: {
    ADMIN: { className: "bg-purple-50 text-purple-700 border-purple-200" },
    MANAGER: { className: "bg-blue-50 text-blue-700 border-blue-200" },
    COORDINATOR: { className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    MEMBER: { className: "bg-gray-100 text-gray-600 border-gray-200" },
  },
};

export function StatusBadge({
  type,
  value,
  className: extraClass,
}: {
  type: keyof typeof CONFIG;
  value: string;
  className?: string;
}) {
  const typeConfig = CONFIG[type];
  const config = typeConfig?.[value];
  const label = config?.label ?? value.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        config?.className,
        extraClass,
      )}
    >
      {label}
    </Badge>
  );
}
