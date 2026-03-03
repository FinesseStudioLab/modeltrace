# Lineage Hash Security Analysis — Fix #81

**Author:** Pieter de Vries  **Date:** 2026-03-03

## Issue

The lineage hash computation in the Audit Registry used a naive string
concatenation of model attributes before hashing. This is vulnerable to
a length extension attack where an adversary can craft two different models
that produce identical lineage hashes by manipulating field lengths.

## Root Cause

```rust
// BEFORE (vulnerable): naive string concatenation
fn compute_lineage_hash(name: &str, version: &str, weights_hash: &str) -> String {
    let combined = format!("{}{}{}",  name, version, weights_hash);
    sha256(&combined)  // length extension attack possible
}
```

If `name="GPT" + version="v1.0" + weights_hash="abc..."` produces the same
combined string as `name="GPTv1.0" + version="" + weights_hash="abc..."`,
two different models get the same lineage hash.

## Fix

Use domain-separated hashing with length prefixes:

```rust
// AFTER: length-prefixed fields prevent extension attacks
fn compute_lineage_hash(name: &str, version: &str, weights_hash: &str) -> String {
    let separated = format!(
        "{}:{}|{}:{}|{}:{}",
        name.len(), name,
        version.len(), version,
        weights_hash.len(), weights_hash
    );
    sha256(&separated)
}
```

The colon + length prefix makes each field boundary unambiguous.
An adversary cannot shift characters between fields to produce a collision.

## Security Impact

Without this fix, a malicious model provider could register a clean model
(GPT-Safe-v1) and then register a compromised version that shares the same
lineage hash, making audit trail verification unreliable. This would undermine
the entire purpose of ModelTrace for regulatory compliance.

## Testing

Added `test_lineage_hash_no_collision` to verify that reordering field content
always produces distinct hashes.
