# AI Provenance Chain Design — #20

**Author:** Pieter de Vries  **Date:** 2026-04-02

## Overview

This document specifies the cryptographic provenance chain for AI models
registered in the ModelTrace Audit Registry. Every registered model has
an unbreakable chain of custody from training data through production deployment.

## The Provenance Chain

```
Training Dataset (IPFS CID) ──────┐
                                   ├──> Model Weights Hash (SHA-256)
Preprocessing Pipeline ────────────┤
                                   ├──> Model Version Record (on-chain)
Architecture Config (IPFS CID) ────┘         │
                                              │
Fine-tuning Data (IPFS CID) ──────────────────┤
                                              │
Evaluation Results (IPFS CID) ────────────────┴──> Audit Registry Entry
```

## On-Chain Fields

The `ModelRecord` stored on-chain contains:
- `weights_hash: String` — SHA-256 of the model weights file at registration time
- `training_data_cid: String` — IPFS CIDv1 of the training dataset manifest
- `version: String` — Semantic version (1.0.0, 1.0.1, etc.)
- `registered_at: u64` — Soroban ledger timestamp
- `operator: Address` — Stellar address of the registering organization

## Why SHA-256 Weights Hash

The SHA-256 hash of model weights is deterministic and collision-resistant.
Any change to the model — even a single weight update — produces a completely
different hash. This means a model cannot be modified after registration without
the registry detecting the discrepancy.

This closes the "silent update" attack surface where a model provider
updates a deployed model without notifying downstream users or regulators.

## Training Data CID

Storing the IPFS CID of the training dataset manifest anchors the model's
learned behavior to its source data. If bias is detected in production, auditors
can trace the distribution of training examples that produced that bias. This
is the core requirement of EU AI Act Article 10 (data governance) and NIST
AI RMF's "Map" function.

## Version Lineage

Each new version registration creates an immutable link to the previous version
via the `prev_version_hash` field. The complete version lineage of any model
is queryable via `get_model_lineage(model_id)`.
