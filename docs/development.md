# Development

## Prerequisites

- **Node.js ≥ 22.13** — pnpm 11 requires it. The version is pinned in
  [`.nvmrc`](../.nvmrc); with `nvm` run `nvm use`.
- **pnpm 11.2.2** — pinned via the `packageManager` field in `package.json` and
  managed by [Corepack](https://nodejs.org/api/corepack.html) (bundled with
  Node). Enable it once:

  ```bash
  corepack enable
  ```

  Corepack then runs the exact pinned pnpm version automatically for every
  `pnpm …` command in this repo.

## Install

```bash
pnpm install
```

CI installs with `pnpm install --frozen-lockfile`; commit the updated
`pnpm-lock.yaml` whenever dependencies change.

## Common commands

Run from the repo root — Turborepo fans each task out across the workspaces and
caches results.

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `pnpm build`      | Build every package/app (`turbo run build`)               |
| `pnpm test`       | Run all tests (`turbo run test`)                          |
| `pnpm lint`       | Lint everything (`turbo run lint`)                        |
| `pnpm typecheck`  | Type-check everything (`turbo run typecheck`)             |
| `pnpm format`     | Format the repo with Prettier                             |

These four (build, test, lint, typecheck) are exactly what `ci.yml` runs on
every PR.

### Working on a single workspace

Use `--filter` with the package name (the `name` field in its `package.json`):

```bash
pnpm --filter @mikecousins/react-pdf test     # the library
pnpm --filter mikecousins-react-pdf-docs dev  # the docs site
pnpm --filter demo dev                         # the Vite demo
pnpm --filter demo-react-router dev            # the React Router demo
```

## The library build

`packages/react-pdf-js` builds with **tsdown** (config in `tsdown.config.ts`)
from the single entry `src/index.tsx`. Output goes to `dist/`:

- `index.js` — ESM
- `index.cjs` — CommonJS
- `index.d.ts` / `index.d.cts` — type declarations

`dist/` is git-ignored and rebuilt in CI before publishing; only `dist/` (plus
`LICENSE`, `README.md`, `package.json`) is included in the published tarball.

## Tests

Vitest with Testing Library, under `packages/react-pdf-js/test/`
(`setup.ts` configures the environment; `usePdf.test.tsx` covers the hook).
Canvas is mocked since PDF.js renders to a `<canvas>`.

```bash
pnpm --filter @mikecousins/react-pdf test
```

## Build constraints

Two non-obvious settings in `pnpm-workspace.yaml` keep builds working under
pnpm 11 — **don't remove them without understanding why**:

- **`overrides.rolldown: 1.0.0-beta.41`** — `tsdown@0.15.6` depends on
  `rolldown: ^1.0.0-beta.9`, but rolldown 1.0.x **stable** is incompatible with
  the bundled `rolldown-plugin-dts` and breaks the build with
  `RUNTIME_MODULE_SYMBOL_NOT_FOUND`. The override pins rolldown to the last
  working version. The proper long-term fix is upgrading `tsdown` to a release
  compatible with rolldown 1.0.x stable; only then drop the override.
- **`allowBuilds`** — pnpm 11 does not run dependency build/postinstall scripts
  unless explicitly approved. The native deps that need to build (`esbuild`,
  `sharp`, `@tailwindcss/oxide`, `unrs-resolver`) are set to `true`. To approve a
  new one, run `pnpm approve-builds` (it writes the entry) and set it to `true`.
