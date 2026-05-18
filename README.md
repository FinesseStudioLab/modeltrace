# ModelTrace

```
 ╔═══════════════════════════════════════════════════════════════╗
 ║   ◉ THE AI AUDIT TRAIL THAT REGULATIONS DEMAND               ║
 ║   Every model. Every weight change. Every inference.          ║
 ║   Immutably sealed on Stellar Soroban.                        ║
 ╚═══════════════════════════════════════════════════════════════╝
```

[![Protocol](https://img.shields.io/badge/Status-Protocol%20Live-7c3aed?style=flat-square)](https://github.com/FinesseStudioLab/modeltrace)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)
[![Stellar](https://img.shields.io/badge/Built%20on-Stellar%20Soroban-0ea5e9?style=flat-square&logo=stellar)](https://stellar.org)
[![EU AI Act](https://img.shields.io/badge/EU%20AI%20Act-Compliant%20Architecture-blue?style=flat-square)](https://artificialintelligenceact.eu)

---

## The Problem No One Solved

A language model makes a loan denial. A vision model flags a job candidate. A trading algorithm executes a position. A medical diagnostic tool rules out cancer.

**None of these systems are required to produce a cryptographic proof of what they knew, when they knew it, and what data shaped their decision.**

This is not a technical limitation. It is a governance vacuum. The tooling to produce immutable AI audit trails has existed in blockchain infrastructure for years. What has not existed is a protocol purpose-built to apply it to AI systems at the model, inference, and training-data layers.

ModelTrace fills that vacuum. Not a compliance checklist. Not an optional transparency dashboard. An on-chain event recorder that makes AI opacity structurally impossible.

---

## What Exists Today

```
modeltrace/
├── apps/
│   ├── web/         ← Next.js 14 — live at modeltrace.vercel.app
│   └── backend/     ← Fastify event indexer
├── contracts/
│   ├── audit-registry/    ← Model registration + AI event logging ✅
│   ├── usage-meter/       ← Inference metering (scaffold — needs builders)
│   └── payment-router/    ← Auditor staking + rewards (scaffold — needs builders)
└── docs/            ← Protocol specs, compliance mappings
```

---

## The Three Contracts

### 1. Audit Registry `contracts/audit-registry` — IMPLEMENTED

```rust
register_model(operator, name, version, weights_hash, training_data_cid) -> model_id
log_inference(operator, model_id, payload_hash, risk_level) -> event_id
flag_bias(auditor, model_id, evidence_hash) -> event_id
get_model(model_id) -> ModelRecord
get_stats() -> RegistryStats { total_models, total_events, high_risk_flags }
```

### 2. Usage Meter `contracts/usage-meter` — needs builders

Per-inference telemetry at scale. Captures per-request metadata without exposing model internals.

`start_session` → `record_inference` → `close_session` → `get_session_stats`

### 3. Attestation Router `contracts/payment-router` — needs builders

Staking and incentive layer for independent AI auditors.

`stake_as_auditor` → `submit_attestation` → `challenge_attestation` → `claim_reward`

---

## Regulatory Alignment

| Framework | Requirement | Coverage |
|---|---|---|
| **EU AI Act (2026)** | Art. 13: Transparency for high-risk AI | ✅ On-chain inference log |
| **EU AI Act** | Art. 12: Logging requirements | ✅ Immutable event registry |
| **NIST AI RMF** | Map & Measure: risk tracking | ✅ Risk level per inference |
| **ISO/IEC 42001** | AI management audit trail | ✅ Cryptographic provenance |

---

## Setup

```bash
git clone https://github.com/FinesseStudioLab/modeltrace
cd modeltrace
stellar contract build --package audit-registry
cargo test --workspace
cd apps/web && npm install && npm run dev
```

---

## Roadmap

### Phase 0 — Foundation `DONE`
- [x] Audit Registry: model registration, inference logging, bias flagging, full tests
- [x] Frontend live with live audit stream, model risk monitor, compliance section
- [x] Neural network background visualization

### Phase 1 — Core Protocol `Q2 2026`
- [ ] Usage Meter contract — per-inference telemetry
- [ ] Attestation Router — auditor staking and rewards
- [ ] All three contracts deployed to Soroban testnet
- [ ] End-to-end audit lifecycle integration test
- [ ] Fastify backend full event indexer

### Phase 2 — Enterprise Integration `Q3 2026`
- [ ] Python SDK: one-line inference logging for ML frameworks
- [ ] MLflow + Hugging Face Hub integrations
- [ ] OpenTelemetry exporter
- [ ] Grafana dashboard: real-time risk visualization

### Phase 3 — Compliance `Q4 2026`
- [ ] EU AI Act compliance certificate generation
- [ ] NIST AI RMF automated scoring
- [ ] Mainnet security audit
- [ ] Bug bounty on Immunefi

### Phase 4 — Mainnet & Scale `Q1 2027`
- [ ] Stellar Mainnet deployment
- [ ] 3 AI lab partnerships for live inference tracing
- [ ] 1,000+ models registered, 100M+ events logged

---

## Why Stellar Soroban

AI audit trails generate millions of events per day. On Ethereum, logging each inference costs $0.50–$5.00 in gas — up to $1.2M/day per model. **This math does not work.** On Stellar: $0.00001 per event. A model can log every inference for $2.40/day. This is the only chain where comprehensive AI auditing is economically viable at scale.

---

## Who We Need

**Rust/Soroban engineers** — Usage Meter and Attestation Router are fully specified.  
**ML engineers** — Python SDK, MLflow/Hugging Face integrations.  
**TypeScript developers** — Wire frontend to live contract state.  
**Security researchers** — Audit the registry contract and staking mechanism.

All issues are labeled `contract`, `sdk`, `frontend`, `backend`, `documentation`, or `research`.

---

*© 2026 FinesseStudioLab contributors · MIT License*
