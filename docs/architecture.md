# Modeltrace Architecture

## Overview
Three-layer architecture: Smart Contracts (Soroban) → Backend API (Fastify) → Frontend (Next.js).

## Contracts
- `audit-registry` — primary registry and state
- `usage-meter` — pooled resources management
- `payment-router` — execution and settlement

## Data Flow
```
User → Frontend (Next.js) → Backend (Fastify) → Soroban RPC → Stellar Network
```
