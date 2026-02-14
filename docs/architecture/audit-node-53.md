# Audit Node Architecture — Refactor #53

**Author:** Pieter de Vries  **Date:** 2026-02-14

## Overview

The ModelTrace audit node is the off-chain component that watches the Soroban
blockchain for Audit Registry events and provides queryable audit data to
the frontend and third-party compliance tools.

## Architecture

```
Soroban RPC ──────────────────┐
                               │ Event stream
                               ▼
                    ┌─────────────────┐
                    │  Event Listener  │  Polls get_events() every 5s
                    └────────┬────────┘
                             │ Parsed events
                             ▼
                    ┌─────────────────┐
                    │   Event Parser   │  Deserializes XDR → typed structs
                    └────────┬────────┘
                             │ Structured data
                             ▼
                    ┌─────────────────┐
                    │   Postgres DB    │  Indexed by model_id, event_type, risk
                    └────────┬────────┘
                             │ SQL queries
                             ▼
                    ┌─────────────────┐
                    │  Fastify API     │  REST + GraphQL endpoints
                    └─────────────────┘
                             │
                    Frontend + Compliance tools
```

## Refactor: Event Deduplication

This refactor adds idempotent event processing. Previously, if the indexer
restarted mid-block, it could ingest the same events twice, producing duplicate
audit records and inflated statistics.

The fix adds a `last_processed_ledger` cursor to the database. On startup,
the indexer resumes from the last confirmed ledger, not from the current block.

```typescript
// Resumable cursor
const lastLedger = await db.query(
  'SELECT MAX(ledger_sequence) FROM audit_events'
);
const startFrom = (lastLedger.rows[0].max ?? 0) + 1;
await indexer.startFrom(startFrom);
```

## API Endpoints After Refactor

- `GET /models` — paginated model registry
- `GET /models/:id/events` — full event history for a model
- `GET /models/:id/lineage` — version lineage chain
- `GET /events?type=BIAS_FLAG&risk=CRITICAL` — filtered event search
- `GET /stats` — aggregate protocol statistics
- `GET /health` — indexer liveness, last indexed block

## Testing

The refactor adds an integration test that simulates an indexer restart
mid-block and verifies that event counts remain consistent.
