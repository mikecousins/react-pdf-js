# Releasing

`@mikecousins/react-pdf` is versioned with [Changesets](https://github.com/changesets/changesets)
and published to npm from CI using **npm trusted publishing (OIDC)** — no
long-lived `NPM_TOKEN`, and every release gets a provenance attestation.

Publishing is **gated on a GitHub Release**: nothing reaches npm until a
maintainer publishes the release. Versioning and publishing are split across two
workflows:

- **`.github/workflows/release.yml`** (on push to `main`) — maintains the
  version bump and produces a draft GitHub Release. Never publishes to npm.
- **`.github/workflows/publish.yml`** (on a GitHub Release being published) —
  builds and runs `pnpm publish` via OIDC. The only step that touches npm.

## One-time setup (before the first release)

Configure the trusted publisher on npm (a maintainer with package access does
this once, in the npmjs.com UI — it cannot be automated):

> npmjs.com → **`@mikecousins/react-pdf`** → **Settings → Trusted Publisher** →
> **GitHub Actions**, with:
> - Organization or user: **`mikecousins`**
> - Repository: **`react-pdf-js`**
> - Workflow filename: **`publish.yml`** (must match exactly)
> - Environment: _leave blank_

Until this exists, `publish.yml` will fail to authenticate.

## The release flow

### 1. Add a changeset in each PR

For any change that should ship, add a changeset and commit it with your PR:

```bash
pnpm changeset
```

It prompts for a **bump type** and a short summary that becomes the changelog
entry:

- **patch** — bug fixes
- **minor** — new, backwards-compatible features
- **major** — breaking changes

This writes a file under `.changeset/`. A PR with no changeset won't trigger a
version bump (fine for docs/CI-only changes).

### 2. Merge PRs to `main`

`release.yml` runs and opens (or updates) an automated **"Version Packages"**
PR. That PR consumes the pending changesets, bumps the version in
`packages/react-pdf-js/package.json`, and updates `CHANGELOG.md`. It refreshes
as more changesets land on `main`. **Nothing is published at this stage.**

### 3. Merge the "Version Packages" PR

When you're ready to ship, merge it. `release.yml` runs again and, because there
are no changesets left to consume, it:

1. creates and pushes the git tag (`@mikecousins/react-pdf@X.Y.Z`), and
2. creates a **draft GitHub Release** for that tag, pre-filled with the
   changelog notes.

### 4. Publish the GitHub Release

Open **GitHub → Releases**, review/edit the draft notes, and click **Publish
release**. This is the deliberate gate — your last chance to review the version
and notes before npm sees anything.

### 5. Automatic publish

Publishing the release triggers `publish.yml`, which checks out the tag,
installs, builds, and runs `pnpm publish` via OIDC. Provenance is enabled (via
`publishConfig` in the library's `package.json`), and the package is published
public. Verify with:

```bash
npm view @mikecousins/react-pdf version
```

## At a glance

```
pnpm changeset (per PR)
        │  merge to main
        ▼
"Version Packages" PR  ──merge──▶  git tag + DRAFT GitHub Release
        ▲                                      │  click "Publish release"
        │ (more changesets refresh it)         ▼
                                       publish.yml → pnpm publish (OIDC) → npm
```

## Local helper scripts

| Script                   | Use                                                     |
| ------------------------ | ------------------------------------------------------- |
| `pnpm changeset`         | Author a changeset (the normal per-PR step)             |
| `pnpm changeset:version` | Preview the version bump + changelog locally            |
| `pnpm changeset:publish` | Manual publish escape hatch — **not** the normal path   |

## Notes & troubleshooting

- **No `NPM_TOKEN`.** Auth is OIDC; `publish.yml` needs `id-token: write` (it has
  it) and must run on a GitHub-hosted runner. Don't add a token.
- **Publish fails with an auth/OIDC error** → check the trusted-publisher config
  above (org/repo/workflow filename must match `publish.yml`).
- **`publish.yml` runs `pnpm publish` directly in the package directory**, not
  through `turbo` — Turborepo filters env vars and would strip the OIDC token.
  Keep it that way.
- **Only the library is released.** The `apps/*` packages are `private` and
  listed under `ignore` in `.changeset/config.json`, so they're never versioned
  or published.
- **Node 22** is required throughout (pnpm 11); the workflows pin it and the repo
  has an `.nvmrc`.
