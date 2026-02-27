# Labyrinth OS — Phase 1 Product Requirements Document

**Version:** 1.0
**Date:** February 26, 2026
**Status:** Draft — Pending CEO Decision Lock
**Authors:** Dev Team
**Stakeholders:** CEO, Engineering, Operations

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Market Context & Competitive Landscape](#3-market-context--competitive-landscape)
4. [Product Vision](#4-product-vision)
5. [Phase 1 Scope & Goals](#5-phase-1-scope--goals)
6. [Phase 1 Non-Goals](#6-phase-1-non-goals)
7. [CEO Decisions Required Before Build](#7-ceo-decisions-required-before-build)
8. [System Architecture](#8-system-architecture)
9. [Tree of Execution Data Model](#9-tree-of-execution-data-model)
10. [Workstream Specifications](#10-workstream-specifications)
11. [API Contract](#11-api-contract)
12. [Database Design](#12-database-design)
13. [Frontend Requirements](#13-frontend-requirements)
14. [Role-Based Access Control](#14-role-based-access-control)
15. [Integration Architecture](#15-integration-architecture)
16. [Testing & Quality Assurance](#16-testing--quality-assurance)
17. [Rollout Plan](#17-rollout-plan)
18. [Success Criteria](#18-success-criteria)
19. [Risks & Mitigations](#19-risks--mitigations)
20. [Appendices](#20-appendices)

---

## 1. Executive Summary

Labyrinth OS is pivoting from a standalone operations platform to a **CRM-agnostic Execution Intelligence Layer** — a system that sits on top of existing tools (GHL, ClickUp, CyberTax, HubSpot) and enforces contract-anchored accountability without forcing teams to abandon their current workflows.

Phase 1 delivers the core intelligence and enforcement engine:
- **Contract-first execution** — every task, deliverable, and decision anchors to a contract
- **Automated accountability loops** — deterministic reminder → warning → escalation chains
- **Red-tag blocking** — enforceable work stoppages with explicit acknowledgment
- **Connector framework** — normalized data ingestion from GHL, ClickUp, and CyberTax
- **Client clarity outputs** — read-only dashboards and AI narrative reports
- **Decision memory** — persistent logging of decisions with outcome tracking

This is not a CRM replacement. This is the accountability and intelligence layer that CRMs don't have.

---

## 2. Problem Statement

### The Core Pain

Service delivery teams use multiple disconnected tools (CRM for sales, project management for execution, spreadsheets for contracts, messaging for communication). This creates:

1. **No single source of truth** for contract execution status
2. **No automated accountability** — missed deadlines go unnoticed until clients complain
3. **No decision trail** — "who decided what and why" lives in Slack threads and memory
4. **No enforceable constraints** — nothing prevents work from proceeding when it shouldn't
5. **No cross-system visibility** — data lives in silos; leadership can't see the full picture

### Why Existing Tools Fail

- **CRMs** (HubSpot, Salesforce, GHL) stop at the sale — they don't manage post-signing execution
- **Project management tools** (ClickUp, Monday, Asana) track tasks but don't enforce accountability chains or contract constraints
- **PSA tools** (Accelo, Productive, Scoro) try to replace all tools instead of layering on top — teams resist adoption
- **Contract tools** (Ironclad, Concord) manage documents, not operations

### The Insight

Teams don't want to change their workflow. They want intelligence and accountability **on top of** the tools they already use. Labyrinth sits in that gap.

---

## 3. Market Context & Competitive Landscape

### Category Definition

Labyrinth OS defines a new category: **Execution Intelligence Layer** (or **Operations Accountability Platform**). No single product currently occupies this space.

### Closest Competitors (Partial Overlap)

| Platform | Price | Overlap | Gap |
|----------|-------|---------|-----|
| **Accelo** | $50-90/user/mo | PSA for agencies — CRM + project mgmt + billing, HubSpot/Salesforce integration | No red-tag blocking, no escalation chains, no contract-anchored constraints |
| **Moxo** | Custom | Client portal with workflow orchestration, automated escalation on stalled approvals | Not CRM-agnostic (it IS the portal), no capacity intelligence, no decision logging |
| **Fullcast.io** | Enterprise | Revenue ops execution layer on top of Salesforce, accountability framework | Sales-only, Salesforce-locked, no contract execution |
| **Gainsight** | $2,500+/mo | CRM overlay concept, health scoring, automated playbooks | Customer success only, no contract constraints, no red-tag blocking |

### Enterprise Platforms (Configurable but Not Purpose-Built)

| Platform | Overlap | Gap |
|----------|---------|-----|
| **Monday.com** ($12-24/seat) | Escalation rules, automations, CRM module | Generic — not contract-anchored, no constraint gates |
| **ClickUp** ($10-19/user) | Blocked status tags, SLA dashboards | Generic PM, no formal escalation chains |
| **HubSpot Ops Hub** ($20-2,000/mo) | Operations intelligence, programmable automation | HubSpot-only, no service delivery |
| **Salesforce Agentforce** ($165+/user) | AI layer on CRM, autonomous workflow execution | Salesforce-only, sales-focused |

### Labyrinth's Unique Capabilities

| Capability | Labyrinth | Nearest Alternative |
|------------|-----------|-------------------|
| CRM-agnostic overlay | Core design | Nobody for service execution |
| Contract-anchored execution | Core design | Nobody for operations |
| Automated 3-tier escalation chains | Native | Moxo (basic only) |
| Red-tag blocking with acknowledgment | Native | **Nobody** |
| AI narrative reports from cross-system data | Native | **Nobody** |
| 7-gate constraint system | Core design | **Completely unique** |
| Decision logging with outcome tracking | Native | Memorist (standalone only) |

### Strategic Positioning

The industry is moving toward AI intelligence layers on CRMs (Salesforce Agentforce, HubSpot Breeze), but they're all ecosystem-locked. Nobody is building a CRM-agnostic version for service delivery accountability. Labyrinth's "layer on top, don't replace" approach directly addresses the adoption resistance that kills PSA tools.

---

## 4. Product Vision

### The Tree of Execution Doctrine

Every contract is a living tree:

| Metaphor | System Object | Description |
|----------|---------------|-------------|
| **Trunk** | Contract | The root of all execution — everything anchors here |
| **Branches** | Milestones | Major deliverable phases within a contract |
| **Sub-branches** | Structured Requests | Individual tasks, document requests, meeting requests, decisions |
| **Leaves** | Team Members / Roles | People assigned to execute |
| **Fruit** | KPIs, Reports, Outcomes | Measurable outputs and narrative reports |
| **Sap** | Communication + AI | The canonical thread and AI-powered insights flowing through everything |

### The Golden Rule

> *If an execution item is not anchored to a contract, logged in communication, tagged with ownership, and bound to a timeline — it is not real.*

Phase 1 enforces this rule programmatically. Any request missing a contract anchor, owner, tag, or due date is rejected by the system.

---

## 5. Phase 1 Scope & Goals

### Definition of Done

Phase 1 is complete when ALL of the following are true:

- [ ] A contract is the root object ("trunk") for all execution, and all requests anchor to it
- [ ] Every request is tagged, owned, timed, and logged in canonical communication — or the system rejects/flags it
- [ ] Reminder → warning → escalation accountability loop runs deterministically
- [ ] One canonical communication thread exists per active contract
- [ ] GHL + ClickUp + CyberTax data can be ingested/synced into normalized Labyrinth records
- [ ] Clients get read-only clarity (status, KPIs, timeline, insights) without execution controls
- [ ] Red-tag / blocking acknowledgments exist for critical issues
- [ ] Decision memory persists decisions with rationale and outcome tracking

### What Phase 1 Delivers

1. **Canonical Models + Tree Schema** — Normalized, connector-agnostic records linked to contracts
2. **Golden Rule Enforcement** — Programmatic rejection of incomplete execution objects
3. **Accountability Loop Engine** — Deterministic reminder → warning → escalation chains
4. **Red-Tag Blocking System** — Severity-based work stoppages with acknowledgment flows
5. **Canonical Communication + Decision Memory** — Enforced contract threads with decision logging
6. **Connector Framework** — GHL, ClickUp, CyberTax adapters with sync logging
7. **Client Clarity Outputs** — Read-only dashboards and AI narrative reports
8. **Capacity Intelligence v1** — Workload visibility and bottleneck detection

---

## 6. Phase 1 Non-Goals

Do **NOT** build in Phase 1:

- Full native replacement for GHL or ClickUp
- 3D/gamified city interface
- Fully autonomous AI conductor
- Real-time unified data warehouse
- Dynamic trust-based permissions
- Native payroll/finance engine
- Client-facing execution controls (clients stay read-only)

---

## 7. CEO Decisions Required Before Build

Six decisions must be locked before implementation begins. Each has a recommended default.

### Decision 1: Source of Truth by Stage

| Data Type | Recommendation |
|-----------|---------------|
| Sales leads & pipeline | **Read from external CRM** (HubSpot first, GHL later). Layer intelligence on top, don't replace. |
| Execution tasks | **Build inside Labyrinth**, add ClickUp sync later. The accountability loop must own tasks to enforce timelines. |
| Contracts & governance | **Labyrinth is source of truth.** Already built. |
| Client notifications | **GHL for delivery** (existing drip campaigns). Labyrinth triggers, GHL delivers. |

### Decision 2: CyberTax Data Integration

| Option | Description | Recommendation |
|--------|-------------|----------------|
| **(A) Direct DB import** | Connect to CyberTax MongoDB directly | **Use for initial migration** |
| **(B) CSV export/import** | Manual file-based transfer | Slower, error-prone |
| **(C) API bridge** | CyberTax sends data via API | **Use for ongoing sync** |

**Recommended:** (A) for initial import, then (C) for ongoing sync.

### Decision 3: Red-Tag Authority

| Option | Acknowledge | Resolve |
|--------|-------------|---------|
| **(A) Self + chain** | Task owner + anyone above (Coordinator → Supervisor → Accountability) | Same — anyone who acknowledged can resolve |
| **(B) Chain only** | Only Coordinators and above | Only Supervisors and above |

**Recommended:** (A) Self + chain. The person closest to the problem acknowledges immediately; if they don't, it auto-escalates.

*Note: Contract-level lifecycle transitions remain restricted to Accountability, Admin, and Executive roles per existing spec.*

### Decision 4: Escalation Timing

| Option | Description |
|--------|-------------|
| **(A) Same for everyone** | 24h / 48h / 72h standard, no exceptions |
| **(B) By client package** | Black/Gold: 12h / 24h / 48h. Bronze/Silver: 24h / 48h / 72h. |
| **(C) Custom per contract** | Each contract sets its own timing |

**Recommended:** (B) Adjustable by client package. Creates tangible premium benefit without per-contract complexity.

### Decision 5: Red-Tag Blast Radius

| Severity | Scope | Example |
|----------|-------|---------|
| **WARNING** (yellow) | Task only | "Design deliverable is 2 days late" — other tasks keep moving |
| **CRITICAL** (red) | Entire milestone | "Client hasn't provided access credentials" — can't proceed with phase |
| **BLOCKER** (hard stop) | Entire contract | "Contract terms violated" or "KPI in red zone with no response" |

| Option | Rule |
|--------|------|
| **(A) Task-only** | All red tags pause only the specific task |
| **(B) Milestone-level** | All red tags pause the milestone |
| **(C) Severity-based** | WARNING → task, CRITICAL → milestone, BLOCKER → contract |

**Recommended:** (C) Severity-based. Gives teeth for real problems without overreacting to minor delays.

### Decision 6: Canonical Thread Scope

| Option | In Thread | Can Happen Elsewhere |
|--------|-----------|---------------------|
| **(A) Everything** | All messages, casual chat, everything | Nothing |
| **(B) Execution items only** | Decisions, task updates, deliverable handoffs, status changes, escalation notices | Casual chat, brainstorming (Slack/Discord) |

**Recommended:** (B) Execution items only. Clean, scannable record of what happened. System auto-posts:
- Task created / completed / overdue
- Reminder / Warning / Escalation notices
- Red tag raised / acknowledged / resolved
- Milestone completed
- Decision logged
- Deliverable uploaded

### Decision Summary

| # | Decision | Recommended Default |
|---|----------|-------------------|
| 1 | Source of truth by stage | CRM reads external, tasks in Labyrinth, contracts in Labyrinth, notifications via GHL |
| 2 | CyberTax import method | (A) Direct DB import, then (C) API bridge |
| 3 | Red-tag authority | (A) Self + chain |
| 4 | Escalation timing | (B) Adjustable by client package |
| 5 | Red-tag blast radius | (C) Severity-based |
| 6 | Canonical thread scope | (B) Execution items only |

**If all defaults are approved, say: "Go with defaults."**

---

## 8. System Architecture

### Current Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Backend** | Python 3.11 / FastAPI | Production-ready |
| **Database** | MongoDB via Motor (async) | Production-ready |
| **Frontend** | React 18 / TailwindCSS / shadcn/ui | Production-ready |
| **State Management** | Zustand | Active (auth, ui, audit stores) |
| **Real-Time** | WebSocket via `websocket_manager.py` | Active |
| **Auth** | JWT (HTTPBearer, 24h expiry) | Production-ready |
| **RBAC** | 10 roles, 50+ permissions | Production-ready |
| **AI** | BYOK (OpenAI, Anthropic, Gemini via OpenRouter) | Active |
| **Build** | CRACO (frontend), uvicorn (backend) | Production-ready |

### Existing Backend Modules (25 registered routers)

The following are already built and operational:

| Router | Prefix | Purpose |
|--------|--------|---------|
| `public_router` | `/api` | Health, login, root (no auth) |
| `api_router` | `/api` | Core playbooks/sops/talents/contracts/kpis/gates/alerts |
| `lifecycle_router` | `/api/lifecycle` | 13-stage contract lifecycle with stage-gating |
| `communication_router` | `/api/communications` | Threads, messages, AI summarization, escalation detection |
| `workflow_router` | `/api/workflowviz` | Hierarchical workflow visualization |
| `role_router` | `/api/roles` | RBAC management and dashboard tiles |
| `sales_router` | `/api/sales` | Lead/proposal management |
| `affiliate_router` | `/api/affiliate` | Referral tracking |
| `playbook_engine_router` | `/api/playbook-engine` | Execution plan generation |
| `client_portal_router` | `/api/client-portal` | Client onboarding journey |
| `team_dashboard_router` | `/api/team-dashboard` | Revenue, campaigns, events, resources |
| `ai_router` | `/api/ai` | AI content generation |
| `ai_manager_router` | `/api/ai-manager` | AI insights and recommendations |
| `ai_ocr_router` | `/api/ai-ocr` | Document scanning |
| `notifications_router` | `/api/notifications` | Drip notification campaigns |
| `bidding_router` | `/api/bidding` | Team bidding workflow |
| `trainings_router` | `/api/trainings` | Training modules |
| `knowledge_base_router` | `/api/knowledge-base` | Documentation/SOPs |
| `external_router` | `/api/external` | CRM webhooks |
| `bulk_router` | `/api/bulk` | CSV/JSON/Excel import |
| `settings_router` | `/api/settings` | BYOK configuration |
| `builder_router` | `/api/builder` | Spreadsheet renderer |
| `permissions_router` | `/api/permissions` | Permission management |
| `client_journey_router` | `/api/client-journey` | Client analytics |
| `websocket_router` | `/ws` | Real-time updates |

### Phase 1 Architecture Additions

```
┌──────────────────────────────────────────────────────────┐
│                    LABYRINTH OS                           │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Tree/Request │  │ Golden Rule │  │Accountability│     │
│  │   Engine     │  │  Enforcer   │  │    Loop      │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                 │             │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐     │
│  │  Red-Tag    │  │  Decision   │  │  Capacity   │     │
│  │  Blocker    │  │   Memory    │  │Intelligence │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                 │             │
│  ┌──────┴────────────────┴─────────────────┴──────┐     │
│  │         Contract Lifecycle (Trunk)              │     │
│  │         + Canonical Communication               │     │
│  └──────────────────┬─────────────────────────────┘     │
│                     │                                    │
│  ┌──────────────────┴─────────────────────────────┐     │
│  │           Connector Framework                   │     │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐    │     │
│  │  │   GHL   │ │ ClickUp  │ │   CyberTax   │    │     │
│  │  │ Adapter │ │ Adapter  │ │   Adapter    │    │     │
│  │  └─────────┘ └──────────┘ └──────────────┘    │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │          Client Clarity Outputs                 │     │
│  │   (Read-Only Dashboards + Narrative Reports)    │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Existing Foundations to Reuse

| Existing Module | Phase 1 Reuse |
|----------------|---------------|
| `contract_lifecycle_models.py` / `_routes.py` | Trunk of tree — extend with request anchoring and red-tag blocking |
| `communication_routes.py` / `communication_models.py` | Canonical thread enforcement — add structured tags and system messages |
| `ai_manager_routes.py` | Reuse reminder mechanics, performance data for reports |
| `workflow_routes.py` / `workflow_models.py` | Workload signals for capacity intelligence |
| `playbook_engine_routes.py` | Assignment metrics for capacity inputs |
| `team_dashboard_routes.py` | Extend with accountability queue and capacity panels |
| `sales_crm_routes.py` / `affiliate_crm_routes.py` | Bridge to canonical sync for sales data |
| `external_api_routes.py` | Reposition as connector surface (avoid confusion with new inbound connectors) |
| `drip_notifications_routes.py` | Reuse notification dispatch for escalation delivery |
| `websocket_manager.py` | New event types for reminders, warnings, escalations, red-tags |
| `gate_logic.py` | Optionally emit red-tags for gate blocks (not only alerts) |
| `client_portal_routes.py` | Add read-only clarity tiles |

---

## 9. Tree of Execution Data Model

### Core Objects

#### CanonicalAccount
Normalized representation of a client/company from any source system.

```
CanonicalAccount:
  id: ObjectId
  display_name: str
  source_links: [EntityLink]          # links to GHL, HubSpot, CyberTax records
  client_package: Bronze|Silver|Gold|Black
  created_at: datetime
  updated_at: datetime
```

#### CanonicalLead
Normalized lead from any CRM source.

```
CanonicalLead:
  id: ObjectId
  account_id: ObjectId (optional)
  contact_name: str
  contact_email: str
  source_links: [EntityLink]
  stage: str                          # normalized funnel stage
  created_at: datetime
```

#### CanonicalTask
Normalized task from any PM tool.

```
CanonicalTask:
  id: ObjectId
  contract_id: ObjectId (required)
  milestone_id: ObjectId (optional)
  request_id: ObjectId (optional)     # links to StructuredRequest
  source_links: [EntityLink]
  title: str
  assignee_id: ObjectId
  status: str
  due_at: datetime
  created_at: datetime
```

#### EntityLink
Cross-system identity mapping.

```
EntityLink:
  source_system: str                  # "ghl", "clickup", "cybertax", "hubspot"
  source_entity: str                  # "contact", "task", "deal"
  source_id: str                      # ID in the source system
  last_synced_at: datetime
  sync_checksum: str                  # for idempotency
```

#### StructuredRequest (Phase 1 Core Object)
The sub-branch of the tree. Every actionable item in execution.

```
StructuredRequest:
  id: ObjectId
  contract_id: ObjectId (required)    # MUST anchor to a contract
  milestone_id: ObjectId (optional)   # anchor to milestone or explicit contract-level
  tag: task|document_request|meeting_request|decision_request (required)
  title: str (required)
  description: str
  owner_id: ObjectId (required)       # who is responsible
  assignees: [ObjectId]
  priority: low|normal|high|urgent (required)
  state: open|in_progress|blocked|completed|cancelled
  due_at: datetime (required)         # Golden Rule: no due date = rejected
  started_at: datetime
  completed_at: datetime
  blocked_by_red_tag_id: ObjectId     # if blocked
  escalation_level: none|reminder|warning|escalated
  communication_refs: [ObjectId]      # messages in canonical thread
  created_at: datetime
  updated_at: datetime
```

### Golden Rule Validation

Every StructuredRequest MUST have:
- `contract_id` — anchored to a contract
- `tag` — categorized (task, document_request, meeting_request, decision_request)
- `owner_id` — assigned to someone
- `due_at` — bound to a timeline
- `priority` — prioritized

If ANY of these are missing, the system **rejects** the request at the API layer with a `422 GoldenRuleViolation`.

---

## 10. Workstream Specifications

### Workstream 0: Architecture Freeze & Shared Vocabulary

**Goal:** Lock definitions before code is written.

**Deliverables:**
- Canonical stage map document (sales funnel → proposal → lobby → contract lifecycle → delivery)
- Tree object vocabulary used across backend/frontend/docs
- Phase 1 sources of truth per object type
- Role boundaries for Phase 1 operations

**Output Files:**
- `memory/TREE_ONTOLOGY_AND_GOLDEN_RULE.md`
- `memory/CANONICAL_STAGE_MAP_PHASE1.md`
- `memory/ROLE_BOUNDARIES_PHASE1.md`
- `memory/INTEGRATION_SOURCE_OF_TRUTH_PHASE1.md`

---

### Workstream 1: Canonical Models + Tree Schema

**Goal:** Create normalized, connector-agnostic records linked to contract lifecycle.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/canonical_models.py` | CanonicalAccount, CanonicalLead, CanonicalProposal, CanonicalContractSeed, CanonicalTask, CanonicalActivity, EntityLink |
| `backend/tree_models.py` | ContractTrunkRef, MilestoneBranchRef, StructuredRequest, RequestTag, RequestPriority, RequestState, TimelineBinding |
| `backend/tree_routes.py` | Contract-scoped request CRUD, read-only tree views |

**Existing Files to Modify:**

| File | Change |
|------|--------|
| `backend/server.py` | Register tree router |
| `backend/contract_lifecycle_models.py` | Add structured request references/hooks |
| `backend/contract_lifecycle_routes.py` | Expose trunk/branch metadata for tree endpoints |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tree/contracts/{contract_id}` | Full tree view of a contract |
| GET | `/api/tree/contracts/{contract_id}/branches` | Milestones for a contract |
| GET | `/api/tree/contracts/{contract_id}/requests` | All requests under a contract |
| POST | `/api/tree/contracts/{contract_id}/requests` | Create request (Golden Rule enforced) |
| PATCH | `/api/tree/requests/{request_id}` | Update request |
| GET | `/api/tree/requests/{request_id}` | Single request detail |

---

### Workstream 2: Golden Rule Enforcement

**Goal:** Reject or flag execution objects that violate the Golden Rule.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/golden_rule_service.py` | `validate_request_realness()`, `validate_execution_event_realness()`, `emit_violation_alert()` |
| `backend/golden_rule_models.py` | GoldenRuleViolation, GoldenRuleViolationType |

**Rules Enforced:**

| Rule | Trigger |
|------|---------|
| No request without contract anchor | POST to `/api/tree/.../requests` missing `contract_id` |
| No request without owner + due date + tag | POST missing required Golden Rule fields |
| No decision change without communication record | State change on decision_request without canonical thread message |
| No milestone completion with unresolved critical requests | PATCH milestone to "completed" while CRITICAL requests are open |
| No contract activation without pre-activation obligations | Stage transition to ACTIVE missing required checklist items |

**Integration Points:** Hooks into `tree_routes.py`, `contract_lifecycle_routes.py`, `communication_routes.py`, `ai_manager_routes.py`, `playbook_engine_routes.py`.

---

### Workstream 3: Accountability Loop Engine

**Goal:** Deterministic enforcement of request timelines.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/accountability_models.py` | ReminderRule, WarningRule, EscalationRule, RequestEscalationEvent, AccountabilityPolicy |
| `backend/accountability_service.py` | `evaluate_due_requests()`, `issue_reminder()`, `issue_warning()`, `issue_escalation()` |
| `backend/accountability_routes.py` | Policy CRUD (admin), escalation queue, acknowledge/override endpoints |

**Default Escalation Chain:**

```
Request approaching due → Reminder issued (24h before)
Request at due time     → Warning issued (at due time)
Request overdue         → Escalation (24h after due)

Escalation route: Owner → Coordinator → Supervisor → Accountability Team
```

**Package-Based Timing (if Decision 4 = B):**

| Package | Reminder | Warning | Escalation |
|---------|----------|---------|------------|
| Bronze/Silver | -24h | at due | +24h |
| Gold/Black | -12h | at due | +24h |

*Escalation route remains the same regardless of package.*

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/accountability/queue` | Pending reminders/warnings/escalations |
| GET | `/api/accountability/escalations` | Active escalations |
| POST | `/api/accountability/policies` | Create/update escalation policy |
| GET | `/api/accountability/policies` | List policies |
| POST | `/api/accountability/run-check` | Manual trigger (admin) |
| POST | `/api/accountability/requests/{id}/acknowledge` | Acknowledge escalation |
| POST | `/api/accountability/requests/{id}/override` | Admin override |

**Integration Points:**
- `communication_routes.py` — auto-post system messages for each escalation step
- `drip_notifications_routes.py` — reuse notification dispatch
- `websocket_manager.py` — new event types: `request.reminder`, `request.warning`, `request.escalated`

---

### Workstream 4: Red-Tag Blocking System

**Goal:** Convert alerts into enforceable incidents with acknowledgment and unblock logic.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/red_tag_models.py` | RedTagIncident, RedTagSeverity (WARNING/CRITICAL/BLOCKER), RedTagScope (request/milestone/contract), RedTagAcknowledgment, RedTagState |
| `backend/red_tag_service.py` | `create_red_tag()`, `acknowledge_red_tag()`, `resolve_red_tag()`, `is_blocking()` |
| `backend/red_tag_routes.py` | Red-tag CRUD and state management |

**Severity-Based Blast Radius (if Decision 5 = C):**

| Severity | Scope | Effect |
|----------|-------|--------|
| **WARNING** | Single request | Only that request is paused; all other work continues |
| **CRITICAL** | Entire milestone | All requests in the milestone are paused |
| **BLOCKER** | Entire contract | All work on the contract stops |

**Authority Matrix (if Decision 3 = A):**

| Action | Who Can Do It |
|--------|---------------|
| Acknowledge red-tag | Task owner + anyone above in chain |
| Resolve red-tag | Anyone who acknowledged |
| Create red-tag | System (automatic) or Coordinator+ (manual) |
| Override/dismiss red-tag | Accountability, Admin, Executive only |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/red-tags` | List all red-tags (filtered by role visibility) |
| GET | `/api/red-tags/{id}` | Single red-tag detail |
| POST | `/api/red-tags` | Create red-tag (manual) |
| POST | `/api/red-tags/{id}/acknowledge` | Acknowledge |
| POST | `/api/red-tags/{id}/resolve` | Resolve and unblock |
| GET | `/api/red-tags/contract/{contract_id}` | Red-tags for a contract |

**Integration Points:**
- `contract_lifecycle_routes.py` — block stage transitions if blocking red-tags exist
- `playbook_engine_routes.py` — block status changes if blocked
- `gate_logic.py` — optionally emit red-tags for gate blocks (not only alerts)
- `models.py` — align alert vs red-tag usage (preserve legacy alert flows)

---

### Workstream 5: Canonical Communication + Decision Memory

**Goal:** Enforce one canonical thread per contract. Persist decisions with rationale.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/decision_memory_models.py` | DecisionRecord, DecisionRationale, DecisionLink (contract/milestone/request/kpi), OutcomeFollowup |
| `backend/decision_memory_service.py` | Extract/store decisions from tagged messages, link to tree objects |
| `backend/decision_memory_routes.py` | Decision CRUD and outcome tracking |

**Communication Thread Rules (Phase 1):**

| Rule | Enforcement |
|------|-------------|
| Every active contract has exactly one canonical thread | Auto-created on ACTIVE stage transition (already exists in lifecycle routes) |
| Execution-related requests must be tagged | Validation on message creation |
| System auto-posts for state changes | Hooks in tree, accountability, and red-tag services |
| Decisions require owner + due date | Golden Rule validation |
| Status changes post to canonical thread | Auto-post hooks |

**System Auto-Post Events:**
- Request created / completed / overdue
- Reminder / Warning / Escalation issued
- Red-tag raised / acknowledged / resolved
- Milestone completed
- Decision logged
- Deliverable uploaded

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/decision-memory/contracts/{contract_id}/decisions` | All decisions for a contract |
| POST | `/api/decision-memory/contracts/{contract_id}/decisions` | Log a decision |
| PATCH | `/api/decision-memory/decisions/{decision_id}` | Update decision |
| POST | `/api/decision-memory/decisions/{decision_id}/outcome` | Record outcome |

---

### Workstream 6: Connector Framework + Sync Logging

**Goal:** Build the inbound integration engine that normalizes external data for Labyrinth.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/integrations_models.py` | IntegrationConnection, IntegrationProvider, SyncRun, SyncRunStatus, SourceRecord, MappingProfile, IntegrationHealthCheck |
| `backend/integrations_service.py` | Connection registry, sync orchestration, health checks |
| `backend/integrations_routes.py` | Admin connection management, sync status/history |
| `backend/integrations_webhook_routes.py` | Public signed webhooks (provider-specific) |
| `backend/integrations_mapping_service.py` | Normalize source payloads → canonical models |
| `backend/integrations_errors.py` | Typed sync errors (auth, schema, rate limit, transient) |
| `backend/adapters/base_adapter.py` | Abstract adapter interface |
| `backend/adapters/ghl_adapter.py` | GoHighLevel adapter |
| `backend/adapters/clickup_adapter.py` | ClickUp adapter |
| `backend/adapters/cybertax_adapter.py` | CyberTax MongoDB import adapter |

**Sync Safeguards (Required):**

| Safeguard | Description |
|-----------|-------------|
| Idempotency | Source checksum prevents duplicate processing |
| Unique identity | `source_system + source_entity + source_id` enforced unique |
| Raw snapshots | Raw payload stored for debugging (with PII policy) |
| Error classification | Auth, schema, rate limit, transient — each with different retry strategy |
| Manual replay | Admin can retry failed syncs |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/integrations/connections` | Create connection |
| GET | `/api/integrations/connections` | List connections |
| GET | `/api/integrations/connections/{id}` | Connection detail |
| PATCH | `/api/integrations/connections/{id}` | Update connection |
| POST | `/api/integrations/connections/{id}/test` | Test connection |
| POST | `/api/integrations/connections/{id}/sync` | Trigger sync |
| GET | `/api/integrations/connections/{id}/sync-runs` | Sync history |
| GET | `/api/integrations/sync-runs/{id}` | Sync run detail |
| POST | `/api/integrations/webhooks/{provider}` | Public webhook (signed, no JWT) |
| GET | `/api/integrations/health` | Health status |
| POST | `/api/integrations/sync-runs/{id}/retry` | Retry failed sync |

---

### Workstream 7: Client Clarity Outputs

**Goal:** Surface "fruit" (KPIs, outcomes, status, timeline, insights) without execution controls.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/client_clarity_models.py` | ClientHealthStatus, FunctionTile, TimelineTile, InsightsTile, NarrativeReportJob, NarrativeReport |
| `backend/client_clarity_routes.py` | Client-facing read-only endpoints |
| `backend/report_engine_service.py` | Aggregate data from contract lifecycle, communications, playbook engine, AI manager; generate narrative reports via AI |

**Client UX Guardrails:**
- Read-only only — no task creation, no approvals, no execution controls
- No raw data tables by default
- Validated data only (flag missing/unverified)
- Clarity in under 30 seconds (UX benchmark)

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/client-clarity/contracts/{contract_id}/overview` | Health summary |
| GET | `/api/client-clarity/contracts/{contract_id}/tiles` | Function tiles |
| GET | `/api/client-clarity/contracts/{contract_id}/timeline` | Timeline view |
| GET | `/api/client-clarity/contracts/{contract_id}/insights` | AI insights |
| POST | `/api/client-clarity/contracts/{contract_id}/reports/narrative` | Generate narrative report |
| GET | `/api/client-clarity/contracts/{contract_id}/reports` | List reports |

---

### Workstream 8: Capacity Intelligence v1

**Goal:** Turn existing workload signals into actionable capacity and bottleneck visibility.

**New Backend Files:**

| File | Contents |
|------|----------|
| `backend/capacity_models.py` | CapacitySnapshot, AllocationRecord, CapacityRisk |
| `backend/capacity_service.py` | Combine workflow team workload + active contract assignments + due requests |
| `backend/capacity_routes.py` | Capacity endpoints |

**Data Sources:** Workflow team workload (workflow_models), active contract assignments (contract_lifecycle), due requests (structured_requests), playbook assignments (playbook_engine).

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/capacity/overview` | System-wide capacity snapshot |
| GET | `/api/capacity/team-members` | Per-member allocation |
| GET | `/api/capacity/contracts/{contract_id}` | Contract resource allocation |
| GET | `/api/capacity/risks` | Overload and bottleneck flags |

---

## 11. API Contract

### New Route Groups (Phase 1)

| Group | Prefix | Auth | New Router File |
|-------|--------|------|----------------|
| Tree / Requests | `/api/tree` | JWT | `tree_routes.py` |
| Accountability | `/api/accountability` | JWT | `accountability_routes.py` |
| Red-Tags | `/api/red-tags` | JWT | `red_tag_routes.py` |
| Decision Memory | `/api/decision-memory` | JWT | `decision_memory_routes.py` |
| Integrations | `/api/integrations` | JWT (admin) | `integrations_routes.py` |
| Webhooks | `/api/integrations/webhooks` | Signed (no JWT) | `integrations_webhook_routes.py` |
| Client Clarity | `/api/client-clarity` | JWT (client+) | `client_clarity_routes.py` |
| Capacity | `/api/capacity` | JWT | `capacity_routes.py` |

### Total New Endpoints: ~45

Broken down by workstream:
- Tree / Requests: 6
- Accountability: 7
- Red-Tags: 6
- Decision Memory: 4
- Integrations: 11
- Client Clarity: 6
- Capacity: 4

---

## 12. Database Design

### New MongoDB Collections

| Collection | Primary Index | Purpose |
|------------|---------------|---------|
| `structured_requests` | `contract_id, state, due_at` | Core execution requests |
| `golden_rule_violations` | `contract_id, created_at` | Enforcement audit trail |
| `accountability_policies` | `package_type` | Escalation timing rules |
| `accountability_events` | `request_id, event_type, created_at` | Reminder/warning/escalation log |
| `red_tags` | `scope_type, scope_id, state, severity` | Red-tag incidents |
| `red_tag_acknowledgments` | `red_tag_id, user_id` | Acknowledgment records |
| `decision_memory` | `contract_id, created_at` | Decision log |
| `decision_outcomes` | `decision_id` | Outcome tracking |
| `integration_connections` | `provider, status` | External system connections |
| `integration_sync_runs` | `connection_id, started_at` | Sync execution log |
| `integration_source_records` | `connection_id, checksum` | Raw source records |
| `canonical_entities` | `entity_type, source_links` | Normalized cross-system records |
| `entity_links` | `source_system, source_entity, source_id` (unique) | Cross-system identity map |
| `narrative_reports` | `contract_id, created_at` | AI-generated reports |
| `capacity_snapshots` | `snapshot_date` | Point-in-time capacity data |

### Required Indexes

```
entity_links(source_system, source_entity, source_id)     — unique
structured_requests(contract_id, state, due_at)            — compound
structured_requests(owner_id, state, due_at)               — compound
red_tags(scope_type, scope_id, state, severity)            — compound
integration_sync_runs(connection_id, started_at)           — compound
integration_source_records(connection_id, checksum)        — compound
decision_memory(contract_id, created_at)                   — compound
accountability_events(request_id, event_type, created_at)  — compound
```

---

## 13. Frontend Requirements

### New Pages/Components

| File | Purpose |
|------|---------|
| `frontend/src/IntegrationsAdmin.jsx` | Admin interface for managing external connections, sync status, health |
| `frontend/src/RedTagsQueue.jsx` | Red-tag queue view with acknowledge/resolve actions |
| `frontend/src/ContractRequestsPanel.jsx` | Structured request management within a contract context |
| `frontend/src/ClientClarityDashboard.jsx` | Read-only client dashboard with tiles, timeline, insights |
| `frontend/src/components/RequestTimerBadge.jsx` | Visual countdown/overdue indicator per request |
| `frontend/src/components/RequestPriorityTag.jsx` | Priority label component (low/normal/high/urgent) |
| `frontend/src/components/RequestStatePill.jsx` | State indicator (open/in_progress/blocked/completed/cancelled) |

### Existing Pages to Modify

| File | Changes |
|------|---------|
| `frontend/src/App.jsx` | Add Phase 1 navigation entries (Integrations, Red-Tags, Client Clarity) |
| `frontend/src/ContractLifecycle.jsx` | Show structured requests, timer indicators, red-tag blocks per contract |
| `frontend/src/Communications.jsx` | Add structured request tagging workflow, system message display |
| `frontend/src/TeamDashboard.jsx` | Add accountability queue panel, capacity overview, blocker summary |
| `frontend/src/ClientPortalDashboard.jsx` | Add client clarity tiles |
| `frontend/src/ClientPortal.jsx` | Phase 1 dashboard/lobby guardrails |
| `frontend/src/lib/api.js` | API methods for all new endpoints |

### UX Rules (Phase 1)

| Rule | Description |
|------|-------------|
| One primary action per screen | Don't overload views with multiple CTAs |
| Visual-first, minimal text | Use badges, pills, timers — not paragraphs |
| Role-specific dashboards | Each role sees only what's relevant |
| Client dashboard stays read-only | No execution controls for clients |
| Calm/premium design language | No noisy controls in operational views |

---

## 14. Role-Based Access Control

### Existing RBAC (10 Roles, 50+ Permissions)

The current system has a mature RBAC implementation. Phase 1 adds new permissions to existing roles.

### Phase 1 Permission Additions

| Permission | Roles |
|------------|-------|
| `CREATE_REQUESTS` | Admin, Executive, Project Director, Manager, Coordinator |
| `VIEW_REQUESTS` | All internal roles |
| `MANAGE_RED_TAGS` | Admin, Accountability |
| `ACKNOWLEDGE_RED_TAGS` | Task owner + chain (Coordinator, Supervisor, Accountability, Admin, Executive) |
| `RESOLVE_RED_TAGS` | Anyone who acknowledged + Admin |
| `VIEW_RED_TAGS` | All internal roles |
| `MANAGE_INTEGRATIONS` | Admin only |
| `VIEW_INTEGRATIONS` | Admin, Executive |
| `MANAGE_ACCOUNTABILITY_POLICIES` | Admin, Accountability |
| `VIEW_ACCOUNTABILITY_QUEUE` | Coordinator+ |
| `LOG_DECISIONS` | All internal roles (in their scope) |
| `VIEW_DECISIONS` | All internal roles |
| `VIEW_CLIENT_CLARITY` | Client, Admin, Executive, Project Director |
| `GENERATE_NARRATIVE_REPORTS` | Admin, Executive, Project Director |
| `VIEW_CAPACITY` | Admin, Executive, Manager, Coordinator |

### Contract Lifecycle Transition Rules (Unchanged)

Only **Accountability**, **Admin**, and **Executive** can move contracts between lifecycle stages. This is preserved from existing spec and is separate from red-tag authority.

---

## 15. Integration Architecture

### Connector Framework Design

```
┌───────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  GHL / HubSpot │────▶│                  │────▶│                  │
│  (Contacts,    │     │   Adapter Layer   │     │  Canonical Model  │
│   Deals, etc.) │     │                  │     │   (Normalized)    │
├───────────────┤     │  - Authenticate   │     │                  │
│  ClickUp       │────▶│  - Fetch/Receive  │────▶│  - EntityLink    │
│  (Tasks,       │     │  - Map fields     │     │  - Checksum      │
│   Spaces)      │     │  - Validate       │     │  - Audit trail   │
├───────────────┤     │  - Deduplicate    │     │                  │
│  CyberTax      │────▶│  - Error classify │────▶│                  │
│  (Leads,       │     │                  │     │                  │
│   Estimates)   │     └──────────────────┘     └──────────────────┘
└───────────────┘
```

### Adapter Interface

Every adapter implements:

| Method | Description |
|--------|-------------|
| `test_connection()` | Validate credentials and connectivity |
| `fetch_records(entity_type, since)` | Pull records from source |
| `map_to_canonical(raw_record)` | Transform to canonical model |
| `handle_webhook(payload, signature)` | Process inbound webhook |
| `get_supported_entities()` | List what entity types this adapter handles |

### Sync Flow

1. **Trigger** — manual, scheduled, or webhook
2. **Fetch** — adapter pulls from source or receives webhook payload
3. **Map** — raw payload → canonical model
4. **Deduplicate** — check `source_system + source_entity + source_id` uniqueness + checksum
5. **Persist** — store canonical record + entity link + raw snapshot
6. **Log** — SyncRun record with status, counts, errors
7. **Notify** — WebSocket event for admin dashboard

### CyberTax Import Strategy (if Decision 2 = A then C)

**Phase 1a:** Direct MongoDB-to-MongoDB import
- Connect to CyberTax MongoDB instance
- Map CyberTax collections to canonical models
- One-time bulk migration with progress tracking

**Phase 1b:** API bridge for ongoing sync
- CyberTax pushes to Labyrinth webhook endpoint
- Or Labyrinth polls CyberTax API on schedule
- Incremental sync with checksum deduplication

---

## 16. Testing & Quality Assurance

### Test Files (Required Before Pilot)

| Test File | Coverage |
|-----------|----------|
| `tests/test_phase1_tree_requests.py` | Request CRUD, Golden Rule validation, tree views |
| `tests/test_phase1_golden_rule.py` | All 5 enforcement rules, violation logging |
| `tests/test_phase1_accountability_loop.py` | Reminder → warning → escalation sequence, timing |
| `tests/test_phase1_red_tags.py` | Create, acknowledge, resolve, blocking behavior |
| `tests/test_phase1_decision_memory.py` | Decision CRUD, outcome tracking, communication links |
| `tests/test_phase1_integrations_registry.py` | Connection management, sync orchestration |
| `tests/test_phase1_ghl_adapter.py` | GHL-specific mapping and sync |
| `tests/test_phase1_clickup_adapter.py` | ClickUp-specific mapping and sync |
| `tests/test_phase1_cybertax_adapter.py` | CyberTax import and ongoing sync |
| `tests/test_phase1_sync_idempotency.py` | Duplicate payload handling |
| `tests/test_phase1_client_clarity_reports.py` | Clarity endpoints, narrative generation |
| `tests/test_phase1_capacity_overview.py` | Capacity calculation, risk detection |

### Test Fixtures

| Directory | Contents |
|-----------|----------|
| `tests/fixtures/ghl/` | Sample GHL API responses |
| `tests/fixtures/clickup/` | Sample ClickUp API responses |
| `tests/fixtures/cybertax/` | Sample CyberTax records |
| `tests/fixtures/canonical/` | Expected canonical model outputs |

### Must-Test Behaviors

| Behavior | Test Type |
|----------|-----------|
| Request rejected if missing contract anchor / owner / tag / due date | Unit |
| Reminder → warning → escalation fires in correct order | Integration |
| Red-tag blocks lifecycle transition until acknowledged/resolved | Integration |
| Canonical thread auto-created on activation and receives system messages | Integration |
| Duplicate sync payload does not create duplicate canonical records | Unit |
| Client dashboard endpoints remain read-only and omit execution controls | Unit |
| Package-based escalation timing applies correctly | Unit |
| Severity-based blast radius scopes correctly | Integration |

---

## 17. Rollout Plan

### Build Sequence (4-Week Target)

#### Week 1: Foundations
- Workstream 0: Architecture freeze, vocabulary lock, stage map
- Workstream 1: Canonical/tree models + request CRUD endpoints
- Workstream 2: Golden Rule validator integrated into request creation

#### Week 2: Accountability Core
- Workstream 3: Accountability loop engine (reminder/warning/escalation)
- Workstream 4: Red-tag system (create/acknowledge/resolve/block)
- Workstream 5: Canonical thread enforcement + decision memory foundations

#### Week 3: Integration
- Workstream 6: Connector framework + sync logging
- GHL adapter MVP
- ClickUp adapter MVP
- CyberTax adapter MVP (import mode based on access)

#### Week 4: Outputs + Hardening
- Workstream 7: Client clarity outputs + narrative report generation
- Workstream 8: Capacity intelligence v1
- Admin UI and ops controls
- Full test suite, pilot hardening

### Pilot Rollout Checklist

| Step | Criteria |
|------|----------|
| Select pilot scope | One internal contract + one controlled client |
| Enable first connector | Prefer CyberTax or primary flow |
| Monitor sync errors | Daily review for first 2 weeks |
| Audit false positives | Review escalations and red-tags for accuracy |
| Verify role boundaries | Confirm dashboards show correct data per role |
| UX validation | Client dashboard clarity achievable in under 30 seconds |

---

## 18. Success Criteria

### Phase 1 Launch Metrics

| Metric | Target |
|--------|--------|
| Every active contract has a canonical communication thread | 100% |
| Every structured request passes Golden Rule validation | 100% enforcement |
| Escalation chain fires within configured timing tolerance | ±5 min |
| Red-tag blocks prevent lifecycle transitions when active | 100% enforcement |
| At least one connector syncing production data | 1+ (CyberTax or GHL) |
| Client clarity dashboard loads in under 3 seconds | p95 |
| Client can understand contract status in under 30 seconds | UX test pass |
| Zero duplicate canonical records from sync | 100% deduplication |
| All Phase 1 test suite passing | 100% green |

### Business Outcomes (Post-Pilot)

| Outcome | Measurement |
|---------|-------------|
| Missed deadlines detected before client complaint | % caught by system vs discovered by client |
| Decision audit trail exists for all contract decisions | % coverage |
| Time to identify blocked work reduced | Before/after comparison |
| Client satisfaction with transparency | NPS or qualitative feedback |

---

## 19. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CEO decisions delayed | Build blocked | Medium | Defaults provided; "go with defaults" option minimizes friction |
| CyberTax DB access unavailable | Connector blocked | Medium | Fall back to CSV import (Decision 2, Option B) |
| GHL/ClickUp API changes or rate limits | Sync reliability | Medium | Error classification + retry logic + admin replay |
| Red-tag false positives disrupt operations | Team frustration | Medium | Start with WARNING severity only; escalate to CRITICAL/BLOCKER after tuning |
| Accountability loop too aggressive | Notification fatigue | Medium | Configurable timing per package; admin override available |
| Frontend scope creep | Schedule slip | High | Strict Phase 1 non-goals list; no execution controls for clients |
| Integration complexity underestimated | Week 3 overrun | Medium | Build connector framework first; adapters can be minimal viable |
| Existing module conflicts | Regression bugs | Low | Align alert vs red-tag usage carefully; preserve legacy flows |

---

## 20. Appendices

### Appendix A: Existing Contract Lifecycle Stages

The 13-stage contract lifecycle is already implemented in `contract_lifecycle_models.py`:

```
STRATEGY → SOW → PROPOSAL → BID_SUBMITTED → BID_APPROVED →
CONTRACT → INACTIVE → QUEUED → ACTIVE → DELIVERY →
PAUSED → COMPLETED → CLOSED
```

Phase 1 hooks into this at ACTIVE stage (canonical thread creation) and blocks transitions when red-tags are active.

### Appendix B: Existing 7-Gate System

The constraint system in `gate_logic.py` remains active and is extended (not replaced) by Phase 1:

1. Strategy Selection — client package filter
2. Level Selection — phase context (ACQUIRE/MAINTAIN/SCALE)
3. Playbook Selection — one per function
4. Talent Matching (CRITICAL) — tier enforcement
5. SOP Activation — context-triggered procedures
6. Contract Enforcement — accountability boundaries
7. KPI Feedback Loop — self-monitoring with alerts

Phase 1 addition: Gate blocks can optionally emit red-tags instead of only alerts.

### Appendix C: Client Package → Level Mapping

| Package | Allowed Levels |
|---------|---------------|
| BRONZE | ACQUIRE only |
| SILVER | ACQUIRE, MAINTAIN |
| GOLD | MAINTAIN only |
| BLACK | MAINTAIN, SCALE |

Phase 1 addition: Package also determines escalation timing (if Decision 4 = B).

### Appendix D: File Inventory (New Files)

**Backend (21 new files):**
```
backend/canonical_models.py
backend/tree_models.py
backend/tree_routes.py
backend/golden_rule_models.py
backend/golden_rule_service.py
backend/accountability_models.py
backend/accountability_service.py
backend/accountability_routes.py
backend/red_tag_models.py
backend/red_tag_service.py
backend/red_tag_routes.py
backend/decision_memory_models.py
backend/decision_memory_service.py
backend/decision_memory_routes.py
backend/integrations_models.py
backend/integrations_service.py
backend/integrations_routes.py
backend/integrations_webhook_routes.py
backend/integrations_mapping_service.py
backend/integrations_errors.py
backend/client_clarity_models.py
backend/client_clarity_routes.py
backend/report_engine_service.py
backend/capacity_models.py
backend/capacity_service.py
backend/capacity_routes.py
backend/adapters/base_adapter.py
backend/adapters/ghl_adapter.py
backend/adapters/clickup_adapter.py
backend/adapters/cybertax_adapter.py
```

**Frontend (7 new files):**
```
frontend/src/IntegrationsAdmin.jsx
frontend/src/RedTagsQueue.jsx
frontend/src/ContractRequestsPanel.jsx
frontend/src/ClientClarityDashboard.jsx
frontend/src/components/RequestTimerBadge.jsx
frontend/src/components/RequestPriorityTag.jsx
frontend/src/components/RequestStatePill.jsx
```

**Documentation (4 new files):**
```
memory/TREE_ONTOLOGY_AND_GOLDEN_RULE.md
memory/CANONICAL_STAGE_MAP_PHASE1.md
memory/ROLE_BOUNDARIES_PHASE1.md
memory/INTEGRATION_SOURCE_OF_TRUTH_PHASE1.md
```

**Tests (12 new files + 4 fixture dirs):**
```
tests/test_phase1_tree_requests.py
tests/test_phase1_golden_rule.py
tests/test_phase1_accountability_loop.py
tests/test_phase1_red_tags.py
tests/test_phase1_decision_memory.py
tests/test_phase1_integrations_registry.py
tests/test_phase1_ghl_adapter.py
tests/test_phase1_clickup_adapter.py
tests/test_phase1_cybertax_adapter.py
tests/test_phase1_sync_idempotency.py
tests/test_phase1_client_clarity_reports.py
tests/test_phase1_capacity_overview.py
tests/fixtures/ghl/
tests/fixtures/clickup/
tests/fixtures/cybertax/
tests/fixtures/canonical/
```

### Appendix E: Stop Conditions

Halt build and escalate if any of these occur:

- CyberTax integration method cannot be confirmed
- GHL/ClickUp source-of-truth boundaries are contested
- Red-tag authority is not explicitly assigned to roles
- Team wants to add Phase 3/4 features before Phase 1 enforcement is stable
- Client dashboard scope expands into execution controls

---

*This PRD synthesizes the CEO Decision Request, Phase 1 Pivot Implementation Checklist, competitive market analysis, and current codebase audit. It is ready for CEO decision lock and team review.*

*Next step: CEO approves or modifies the 6 decisions in Section 7, then Workstream 0 begins immediately.*
