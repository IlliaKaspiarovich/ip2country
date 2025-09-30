# IP → Country

Small Vue 3 + TypeScript app that resolves IP addresses to country and shows local time (live). Supports IPv4 and IPv6.

## Public link

https://illiakaspiarovich.github.io/ip2country/

## Technologies

- Vue 3, TypeScript, Vite
- Vitest (unit tests)
- ESLint (flat), Prettier
- Husky + lint-staged
- GitHub Actions (CI + Pages deploy)

## Fetch optimizations

Implemented in `src/api/ipLookup.ts`:

- **Caching** with TTL to avoid repeat lookups
- **In-flight deduplication** per IP
- **Concurrency limiting** to reduce rate-limit hits

## Workflows

`.github/workflows/`

- **deploy.yml** – build and deploy to GitHub Pages
- **lint-format.yml** – `eslint` + `prettier --check` on PRs
- **ci.yml** – install, build, test

## Run locally

```bash
# Node 20+ recommended
npm i
npm run dev      # http://localhost:5173

```
