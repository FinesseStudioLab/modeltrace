# Contributing to Modeltrace

Thank you for contributing to Modeltrace! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Ways to Contribute

- 🐛 **Bug reports** — open an issue with reproduction steps
- ✨ **Feature requests** — open an issue describing the use case
- 💻 **Code contributions** — pick an issue and submit a PR
- 📖 **Documentation** — improve docs, examples, and guides
- 🔍 **Code review** — review open PRs

## Development Setup

```bash
git clone https://github.com/grantfox-org/modeltrace.git
cd modeltrace
pnpm install
pnpm dev
```

## Branching Strategy

- `main` — stable, production-ready
- `develop` — integration branch
- Feature branches: `feat/your-feature-name`
- Fix branches: `fix/issue-description`

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add payout oracle adapter
fix: resolve storage collision in modeltrace
docs: update contract architecture diagram
test: add integration tests for pool manager
chore: upgrade stellar-sdk to v11
```

## Pull Request Process

1. Fork and create a branch from `develop`
2. Write tests for your changes
3. Ensure `pnpm lint` and `cargo clippy` pass
4. Open a **draft PR** early for feedback
5. Fill in the PR template completely
6. Request review from a maintainer

## Issue Labels

| Label | Description |
|-------|-------------|
| `good first issue` | Beginner-friendly, well-scoped |
| `contracts` | Soroban smart contract work |
| `frontend` | Next.js UI work |
| `backend` | Fastify API work |
| `documentation` | Docs improvements |
| `testing` | Test coverage |
| `security` | Security-related |
| `phase-1/2/3` | Delivery phase |

## Review SLA

- Maintainers will respond to PRs within **3 business days**
- Draft PRs reviewed within **5 business days**

## Questions?

Open a [Discussion](https://github.com/grantfox-org/modeltrace/discussions) on GitHub.
