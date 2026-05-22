# Contributor documentation

Internal docs for working on the `react-pdf-js` repository. End-user/API
documentation for the library lives in the root [`README.md`](../README.md)
and on the docs site at <https://react-pdf.cousins.ai>.

- [Development](./development.md) — prerequisites, install, and day-to-day commands.
- [Releasing](./releasing.md) — how a new version is versioned, tagged, and published to npm.

## What this repository is

A [pnpm workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turborepo.com)
monorepo for **[`@mikecousins/react-pdf`](https://www.npmjs.com/package/@mikecousins/react-pdf)**,
a React library that renders PDF documents with [PDF.js](https://mozilla.github.io/pdf.js/).
The library exposes a single hook, `usePdf`, which loads a PDF and renders a
page to a `<canvas>`. It targets React 19 and `pdfjs-dist` 5 (both peer
dependencies).

## Toolchain

| Concern            | Tool                                        |
| ------------------ | ------------------------------------------- |
| Package manager    | pnpm `11.2.2` (pinned via `packageManager`) |
| Task orchestration | Turborepo (`turbo.json`)                    |
| Library bundling   | [tsdown](https://tsdown.dev) (ESM + CJS + d.ts) |
| Tests              | Vitest + Testing Library                    |
| Lint / format      | ESLint + Prettier                           |
| Language           | TypeScript                                  |
| Versioning/publish | Changesets + npm trusted publishing (OIDC)  |

> **Node 22 required.** pnpm 11 needs Node ≥ 22.13; the repo pins Node via
> [`.nvmrc`](../.nvmrc). See [Development](./development.md).

## Repository structure

```
react-pdf-js/
├── packages/
│   └── react-pdf-js/        # @mikecousins/react-pdf — the published library
│       ├── src/index.tsx    # the usePdf hook + types (the entire public API)
│       ├── test/            # Vitest tests (usePdf.test.tsx, setup.ts)
│       └── tsdown.config.ts # build config (ESM + CJS + declarations → dist/)
├── apps/                    # all private (not published); deployed to Netlify previews
│   ├── demo/                # Vite demo            → react-pdf-js-demo-vite
│   ├── demo-react-router/   # React Router demo    → react-pdf-js-demo-react-router
│   └── docs/                # Next.js marketing + docs site → react-pdf.cousins.ai
├── .changeset/              # Changesets config + pending changeset files
├── .github/workflows/       # ci.yml, release.yml, publish.yml
├── pnpm-workspace.yaml      # workspace globs, build-script allowlist, dependency overrides
├── turbo.json               # Turborepo task pipeline (build/lint/test/typecheck/dev)
├── package.json             # root scripts, dev deps, packageManager pin
└── .nvmrc                   # Node version (22)
```

### Packages

- **`packages/react-pdf-js`** (`@mikecousins/react-pdf`) — the only published
  package. Source is a single file, `src/index.tsx`; it builds with tsdown to
  `dist/` as ESM (`index.js`), CJS (`index.cjs`), and type declarations. Only
  `dist/` is published (see `files` in its `package.json`).

### Apps (all `private: true`)

These exist to exercise and showcase the library; each depends on it via
`workspace:*` and is excluded from versioning/publishing.

- **`apps/demo`** — minimal Vite + React demo.
- **`apps/demo-react-router`** — React Router (framework mode) demo.
- **`apps/docs`** — Next.js marketing/documentation site (Markdoc + Tailwind),
  deployed at <https://react-pdf.cousins.ai>.

### Key root files

- **`pnpm-workspace.yaml`** — workspace package globs; `allowBuilds` (approves
  native dependency build scripts: esbuild, sharp, `@tailwindcss/oxide`,
  `unrs-resolver`); and `overrides` (pins `rolldown` — see
  [Development → build constraints](./development.md#build-constraints)).
- **`turbo.json`** — task graph. `build`/`typecheck` depend on upstream builds
  (`^build`); `test` and `typecheck` are uncached; `dev` is persistent.
- **`.changeset/config.json`** — Changesets config (public access; the private
  apps are ignored so only the library is versioned).
- **`.github/workflows/`** — `ci.yml` (build/lint/test/typecheck on PRs),
  `release.yml` (version PR + draft release), `publish.yml` (OIDC publish). See
  [Releasing](./releasing.md).
