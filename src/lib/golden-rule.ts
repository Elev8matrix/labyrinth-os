/**
 * Golden Rule Enforcement
 *
 * Every request MUST have:
 * 1. contractId — anchor to the trunk
 * 2. title      — what is this request
 * 3. tag        — categorization
 * 4. ownerId    — who is responsible
 * 5. dueAt      — when is it due
 */

type Violation = { field: string; message: string };

interface GoldenRuleInput {
  contractId?: string;
  title?: string;
  tag?: string;
  ownerId?: string;
  dueAt?: string | Date;
}

export function validateGoldenRule(data: GoldenRuleInput): {
  valid: boolean;
  violations: Violation[];
} {
  const violations: Violation[] = [];

  if (!data.contractId) {
    violations.push({
      field: "contractId",
      message: "Every request must be anchored to a contract",
    });
  }

  if (!data.title || !data.title.trim()) {
    violations.push({
      field: "title",
      message: "Request title is required",
    });
  }

  if (!data.tag) {
    violations.push({
      field: "tag",
      message: "Request must have a tag (TASK, DELIVERABLE, APPROVAL, etc.)",
    });
  }

  if (!data.ownerId) {
    violations.push({
      field: "ownerId",
      message: "Every request must have an assigned owner",
    });
  }

  if (!data.dueAt) {
    violations.push({
      field: "dueAt",
      message: "Every request must have a due date",
    });
  }

  return { valid: violations.length === 0, violations };
}
