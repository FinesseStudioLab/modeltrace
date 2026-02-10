# GitHub Issues Backlog — Modeltrace

## Batch 1 — Foundation & Scaffolding (Phase 1)

### Issue 1: Initialize `audit-registry` contract scaffold
**Labels:** `contracts` `good first issue` `phase-1`
Initialize the Soroban contract with `initialize`, `version`, and storage types.
**Acceptance Criteria:** Contract compiles to WASM, `cargo test` passes, basic storage read/write verified.

---

### Issue 2: Define storage data types for `audit-registry`
**Labels:** `contracts` `good first issue` `phase-1`
Define all `#[contracttype]` structs and enums. Document each field in `docs/contracts.md`.
**Acceptance Criteria:** All types derive required traits, no compilation warnings.

---

### Issue 3: Implement `audit-registry` core write functions
**Labels:** `contracts` `phase-1`
Implement primary state mutation functions. Add `require_auth` to all privileged paths.
**Acceptance Criteria:** Unit tests pass, auth enforced, no panics on valid input.

---

### Issue 4: Implement `audit-registry` query functions
**Labels:** `contracts` `good first issue` `phase-1`
Add read-only view functions returning typed contract state.
**Acceptance Criteria:** Functions return `Option<T>` correctly, tested for missing keys.

---

### Issue 5: Initialize `usage-meter` contract scaffold
**Labels:** `contracts` `good first issue` `phase-1`
Mirror of Issue 1 for the `usage-meter` contract.
**Acceptance Criteria:** Compiles, `initialize` called once, version exposed.

---

### Issue 6: Implement `usage-meter` pool/management logic
**Labels:** `contracts` `phase-1`
Implement the core pooling or management logic unique to `usage-meter`.
**Acceptance Criteria:** Integration test simulates full lifecycle, edge cases covered.

---

### Issue 7: Initialize `payment-router` contract scaffold
**Labels:** `contracts` `good first issue` `phase-1`
Scaffold the `payment-router` contract with required entrypoints.
**Acceptance Criteria:** Compiles, unit tested.

---

### Issue 8: Implement `payment-router` execution logic
**Labels:** `contracts` `phase-1`
Implement deterministic execution: oracle inputs, settlement, or dispatch logic.
**Acceptance Criteria:** At least 3 test cases, no unchecked arithmetic.

---

## Batch 2 — Frontend (Phase 2)

### Issue 9: Build landing page hero section
**Labels:** `frontend` `good first issue` `phase-2`
Implement `app/page.tsx` hero: headline, tagline, CTA buttons, animated badge.
**Acceptance Criteria:** Matches design spec, responsive on mobile/tablet/desktop.

---

### Issue 10: Build navigation component
**Labels:** `frontend` `good first issue` `phase-2`
Create `components/layout/Nav.tsx` with mobile hamburger, active link highlighting.
**Acceptance Criteria:** Passes axe accessibility, keyboard navigable.

---

### Issue 11: Implement site map / Expected Pages component
**Labels:** `frontend` `phase-2`
Create `components/sections/ExpectedPages.tsx` rendering page status from `docs/SITE_MAP.md`.
**Acceptance Criteria:** Dynamic, color-coded status badges, links to issues.

---

### Issue 12: Build feature grid component
**Labels:** `frontend` `good first issue` `phase-2`
Implement `components/sections/FeatureGrid.tsx` with animated card hover effects.
**Acceptance Criteria:** 6 cards, smooth CSS transitions, dark-mode safe.

---

### Issue 13: Implement stats counter section
**Labels:** `frontend` `phase-2`
Animated stat counters (contributors, commits, issues) using Intersection Observer.
**Acceptance Criteria:** Counters animate on scroll, SSR-safe.

---

### Issue 14: Build contributor showcase component
**Labels:** `frontend` `phase-2`
Show contributor avatars + names fetched from GitHub API via `apps/backend`.
**Acceptance Criteria:** Falls back gracefully on API failure, cached for 1 hour.

---

### Issue 15: Add dark/light mode toggle
**Labels:** `frontend` `good first issue` `phase-2`
Implement theme toggle in Nav using `next-themes`.
**Acceptance Criteria:** Persists across sessions, no flash of unstyled content.

---

### Issue 16: Build roadmap timeline page (`/roadmap`)
**Labels:** `frontend` `phase-2`
Vertical timeline component with phase markers and delivery status.
**Acceptance Criteria:** Responsive, accessible, data-driven from `docs/milestones-issues.md`.

---

## Batch 3 — Backend API (Phase 2)

### Issue 17: Scaffold Fastify server with health endpoint
**Labels:** `backend` `good first issue` `phase-2`
Initialize `apps/backend` with Fastify, `GET /health`, env config, and TypeScript.
**Acceptance Criteria:** Returns `200 OK` with JSON, runs in Docker, tested with Vitest.

---

### Issue 18: Implement `/api/v1/stats` endpoint
**Labels:** `backend` `phase-2`
Aggregate contract stats from Soroban via `@stellar/stellar-sdk`. Cache in Redis.
**Acceptance Criteria:** Returns count data, 200ms p95, cache TTL configurable.

---

### Issue 19: Implement Soroban event streaming
**Labels:** `backend` `phase-2`
Stream Soroban contract events to frontend via Server-Sent Events.
**Acceptance Criteria:** Client receives events within 500ms of on-chain confirmation.

---

### Issue 20: Add JWT authentication to admin endpoints
**Labels:** `backend` `security` `phase-2`
Protect privileged routes with JWT middleware. Add `/api/v1/auth/token` endpoint.
**Acceptance Criteria:** Protected routes return 401 without valid token, OWASP baseline met.

---

## Batch 4 — DevOps & Testing (Phase 3)

### Issue 21: Set up GitHub Actions CI pipeline
**Labels:** `ci/cd` `good first issue` `phase-3`
Workflow: lint, test, cargo check, WASM build on every PR.
**Acceptance Criteria:** CI passes on clean branch, fails visibly on Clippy errors.

---

### Issue 22: Write contract integration tests
**Labels:** `contracts` `testing` `phase-3`
End-to-end tests simulating full protocol lifecycle using `soroban-sdk` test utilities.
**Acceptance Criteria:** 100% of public contract functions covered.

---

### Issue 23: Add E2E tests with Playwright
**Labels:** `frontend` `testing` `phase-3`
Cover critical user flows: landing, nav, roadmap page.
**Acceptance Criteria:** Runs in CI, no flaky assertions.

---

### Issue 24: Write API integration tests
**Labels:** `backend` `testing` `phase-3`
Test all API routes with Vitest + Supertest, including error cases.
**Acceptance Criteria:** 90%+ route coverage, edge cases handled.

---

### Issue 25: Testnet deployment scripts
**Labels:** `contracts` `devops` `phase-3`
`scripts/deploy-testnet.sh` deploys all contracts, saves addresses to `.env`.
**Acceptance Criteria:** Idempotent, outputs contract IDs, works in CI.

---

## Batch 5 — Docs & Community (All Phases)

### Issue 26: Write detailed CONTRIBUTING.md
**Labels:** `documentation` `good first issue`
Expand contributing guide: branching strategy, commit conventions, review SLA.
**Acceptance Criteria:** Passes markdown lint, links all relevant resources.

---

### Issue 27: Write contract architecture doc
**Labels:** `documentation` `phase-1`
`docs/contracts.md`: data model diagrams, function signatures, security notes.
**Acceptance Criteria:** Mermaid diagrams render on GitHub, reviewed by 2 contributors.

---

### Issue 28: Add issue templates
**Labels:** `documentation` `good first issue`
Create `.github/ISSUE_TEMPLATE/` for bug, feature, and good-first-issue templates.
**Acceptance Criteria:** Templates appear in GitHub UI, fields validated.

---

### Issue 29: Add PR template
**Labels:** `documentation` `good first issue`
`.github/pull_request_template.md` with checklist: tests, docs, breaking changes.
**Acceptance Criteria:** Template pre-fills on all PRs.

---

### Issue 30: Write API documentation
**Labels:** `documentation` `backend` `phase-2`
OpenAPI spec in `docs/api.yaml`, viewable via Swagger UI at `/api/docs`.
**Acceptance Criteria:** All endpoints documented, examples included.
