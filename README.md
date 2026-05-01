# Software Transaction Structuring Tool

A dual-mode tool for South African B2B software companies to find optimal pricing and compare transaction structures.

## Modes

1. **Pricing Calculator** — Find the price where you hit your margin AND your client sees ROI
2. **Transaction Structuring** — Compare 6 models (47 variants) to find the best deal for both parties

## Quick Start

```bash
pnpm install        # install workspace dependencies
pnpm dev            # run dev server (apps/web)
pnpm test           # 301 calculator unit tests
pnpm check          # typecheck + theme-token drift assertion
pnpm lint           # ESLint across both workspaces
pnpm build          # production build (calculator → web)
pnpm test:e2e       # Playwright E2E tests
```

`pnpm check` and `pnpm lint` must pass before opening a PR — see
[`docs/README.md`](docs/README.md) for full development workflow.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/README.md](docs/README.md) | Project overview and quick start |
| [docs/BUSINESS_GUIDE.md](docs/BUSINESS_GUIDE.md) | User guide with tutorials |
| [docs/CALCULATIONS.md](docs/CALCULATIONS.md) | Formula explanations |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture |
| [docs/model-use-cases/](docs/model-use-cases/) | When to use each model variant |
| [CLAUDE.md](CLAUDE.md) | AI assistant context and development guide |

## Tech Stack

TypeScript · SvelteKit · Tailwind CSS · Vitest · Playwright

## License

MIT
