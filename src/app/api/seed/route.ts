import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  // Clear existing data (in reverse dependency order)
  await db.auditLog.deleteMany();
  await db.decision.deleteMany();
  await db.assignment.deleteMany();
  await db.redTag.deleteMany();
  await db.request.deleteMany();
  await db.milestone.deleteMany();
  await db.contract.deleteMany();
  await db.user.deleteMany();

  // Users
  const admin = await db.user.create({
    data: {
      name: "Ayo Elev8",
      email: "ayo@elev8matrix.com",
      role: "ADMIN",
    },
  });

  const coordinator = await db.user.create({
    data: {
      name: "Sarah Coordinator",
      email: "sarah@elev8matrix.com",
      role: "COORDINATOR",
    },
  });

  const member = await db.user.create({
    data: {
      name: "James Member",
      email: "james@elev8matrix.com",
      role: "MEMBER",
    },
  });

  // Contracts
  const techCorp = await db.contract.create({
    data: {
      name: "TechCorp Digital Transformation",
      clientName: "TechCorp Industries",
      clientPackage: "GOLD",
      stage: "ACTIVE",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      value: 85000,
    },
  });

  const greenLeaf = await db.contract.create({
    data: {
      name: "GreenLeaf Brand Launch",
      clientName: "GreenLeaf Wellness",
      clientPackage: "SILVER",
      stage: "ACTIVE",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-05-31"),
      value: 42000,
    },
  });

  const nova = await db.contract.create({
    data: {
      name: "Nova Fitness Rebrand",
      clientName: "Nova Fitness",
      clientPackage: "BRONZE",
      stage: "DRAFT",
      value: 25000,
    },
  });

  const apex = await db.contract.create({
    data: {
      name: "Apex Holdings Full Suite",
      clientName: "Apex Holdings LLC",
      clientPackage: "BLACK",
      stage: "ON_HOLD",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-08-31"),
      value: 150000,
      notes: "On hold pending budget approval for Q2",
    },
  });

  // Milestones
  const tcDiscovery = await db.milestone.create({
    data: {
      contractId: techCorp.id,
      title: "Discovery & Audit",
      status: "COMPLETED",
      dueDate: new Date("2026-02-15"),
      sortOrder: 1,
    },
  });

  const tcImplement = await db.milestone.create({
    data: {
      contractId: techCorp.id,
      title: "Implementation Sprint 1",
      status: "IN_PROGRESS",
      dueDate: new Date("2026-03-31"),
      sortOrder: 2,
    },
  });

  const glStrategy = await db.milestone.create({
    data: {
      contractId: greenLeaf.id,
      title: "Brand Strategy",
      status: "IN_PROGRESS",
      dueDate: new Date("2026-03-15"),
      sortOrder: 1,
    },
  });

  const glLaunch = await db.milestone.create({
    data: {
      contractId: greenLeaf.id,
      title: "Launch Campaign",
      status: "NOT_STARTED",
      dueDate: new Date("2026-05-01"),
      sortOrder: 2,
    },
  });

  // Requests
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

  await db.request.createMany({
    data: [
      {
        contractId: techCorp.id,
        milestoneId: tcImplement.id,
        title: "Set up CI/CD pipeline",
        tag: "TASK",
        priority: "HIGH",
        state: "IN_PROGRESS",
        ownerId: coordinator.id,
        dueAt: daysFromNow(5),
        startedAt: daysAgo(3),
      },
      {
        contractId: techCorp.id,
        milestoneId: tcImplement.id,
        title: "Client sign-off on wireframes",
        tag: "APPROVAL",
        priority: "URGENT",
        state: "OPEN",
        ownerId: admin.id,
        dueAt: daysAgo(2), // overdue
      },
      {
        contractId: techCorp.id,
        milestoneId: tcDiscovery.id,
        title: "Final audit report",
        tag: "DELIVERABLE",
        priority: "NORMAL",
        state: "COMPLETED",
        ownerId: admin.id,
        dueAt: daysAgo(10),
        completedAt: daysAgo(12),
      },
      {
        contractId: greenLeaf.id,
        milestoneId: glStrategy.id,
        title: "Competitive analysis document",
        tag: "DOCUMENT_REQUEST",
        priority: "HIGH",
        state: "IN_PROGRESS",
        ownerId: member.id,
        dueAt: daysFromNow(3),
        startedAt: daysAgo(5),
      },
      {
        contractId: greenLeaf.id,
        milestoneId: glStrategy.id,
        title: "Brand positioning workshop",
        tag: "MEETING_REQUEST",
        priority: "NORMAL",
        state: "OPEN",
        ownerId: coordinator.id,
        dueAt: daysFromNow(7),
      },
      {
        contractId: greenLeaf.id,
        milestoneId: glLaunch.id,
        title: "Launch budget approval",
        tag: "BILLING",
        priority: "URGENT",
        state: "OPEN",
        ownerId: admin.id,
        dueAt: daysAgo(1), // overdue
      },
      {
        contractId: apex.id,
        title: "Scope review meeting",
        tag: "MEETING_REQUEST",
        priority: "LOW",
        state: "BLOCKED",
        ownerId: admin.id,
        dueAt: daysFromNow(14),
      },
      {
        contractId: techCorp.id,
        milestoneId: tcImplement.id,
        title: "API integration specs",
        tag: "DOCUMENT_REQUEST",
        priority: "NORMAL",
        state: "OPEN",
        ownerId: member.id,
        dueAt: daysFromNow(10),
      },
    ],
  });

  // Red Tags
  await db.redTag.create({
    data: {
      contractId: techCorp.id,
      milestoneId: tcImplement.id,
      severity: "WARNING",
      title: "Wireframe approval overdue",
      description:
        "Client has not signed off on wireframes. Blocking downstream implementation tasks.",
      state: "OPEN",
      createdById: coordinator.id,
    },
  });

  await db.redTag.create({
    data: {
      contractId: greenLeaf.id,
      severity: "CRITICAL",
      title: "Budget not approved for launch phase",
      description:
        "Launch campaign budget has not been approved. Risk of missing launch date.",
      state: "OPEN",
      createdById: admin.id,
    },
  });

  // Decision
  await db.decision.create({
    data: {
      contractId: techCorp.id,
      title: "Switch to Next.js for client portal",
      rationale:
        "The original React SPA approach had SEO issues. Next.js gives us SSR + API routes in one deployment.",
      category: "STRATEGIC",
      status: "ACTIVE",
      outcome: "PENDING",
      decidedById: admin.id,
    },
  });

  await db.decision.create({
    data: {
      contractId: greenLeaf.id,
      title: "Delay launch by 2 weeks",
      rationale:
        "Competitive analysis revealed new market entrant. Need to adjust positioning before launch.",
      category: "OPERATIONAL",
      status: "ACTIVE",
      outcome: "NEUTRAL",
      decidedById: admin.id,
    },
  });

  return NextResponse.json({
    success: true,
    counts: {
      users: 3,
      contracts: 4,
      milestones: 4,
      requests: 8,
      redTags: 2,
      decisions: 2,
    },
  });
}
