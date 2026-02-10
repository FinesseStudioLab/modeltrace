# Layout Plan

## Repository map
- `contracts/audit-registry`: signed inference proof registry
- `contracts/usage-meter`: quota, tiering, and billable unit accounting
- `contracts/payment-router`: escrow, settlement, disputes
- `apps/web`: governance dashboard and operator portal
- `configs`: environment templates and network configs
- `.github/workflows`: CI for contracts, web linting, and release checks

## Engineering lanes
- **Protocol lane**: contract interfaces, event schemas, and security reviews
- **Platform lane**: APIs, indexing, and invoice export service
- **Product lane**: operator UX for policy setup and audit lookup

## Non-functional requirements
- deterministic settlement paths
- complete event traceability
- audit export under 5 seconds for 10k records
- fail-safe pausing and emergency controls

## Runtime layout (monorepo)

| Path | Responsibility |
| --- | --- |
| `contracts/*` | Soroban smart contracts — source of truth for rules |
| `apps/web` | Next.js — marketing, dashboards, contributor UX |
| `apps/backend` | Fastify — integrations, optional server-side signing gateway |

See also `docs/SITE_MAP.md` for the web route backlog.
