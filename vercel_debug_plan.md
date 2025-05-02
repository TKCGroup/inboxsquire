# Vercel Deployment Debug Plan

## Issue

Vercel builds for the `apps/web` Next.js application are failing with the error:

```
[Error: > Couldn't find any `pages` or `app` directory. Please create one under the project root]
```

This occurs during the `next build` step.

## Findings & Analysis

1.  **Initial Hypothesis (Turborepo):** Early investigation considered Turborepo caching or configuration issues (details might be in prior conversation history).
2.  **Build Log Analysis:**
    *   Vercel correctly identifies the framework (`nextjs`) and the project root.
    *   The root `npm install` runs successfully.
    *   The specified `buildCommand` from `vercel.json` (`cd apps/web && npm install && npx next build`) is executed.
    *   The `npm install` within `apps/web` completes successfully.
    *   Crucially, the `npx next build` command triggers a warning: `npm warn exec The following package was not found and will be installed: next@15.3.1`.
    *   This indicates that `npx` is fetching and executing the *latest* version of Next.js (15.3.1) instead of using the version specified in `apps/web/package.json` (14.2.15).
    *   The build subsequently fails with the directory not found error, likely because `next@15.3.1` (when run via `npx` in this environment) cannot locate the `src/app` directory relative to the `apps/web` working directory.
3.  **Configuration Review:**
    *   `vercel.json` explicitly defines `buildCommand": "cd apps/web && npm install && npx next build"`.
    *   `apps/web/package.json` defines `"build": "next build"` script and depends on `"next": "14.2.15"`.
    *   The user confirmed Vercel UI overrides are disabled, so `vercel.json` is the source of truth for the build command.

## Attempt 1: Use `npm run build`

**Change:**
From: `"buildCommand": "cd apps/web && npm install && npx next build"`
To: `"buildCommand": "cd apps/web && npm install && npm run build"`

**Result:**
- Resolved the `Couldn't find any pages or app directory` error.
- New error surfaced: `Error: The file "/vercel/path0/apps/web/.next/routes-manifest.json" couldn't be found.`
- **Analysis:** The build logs showed that `npm run build` inside `apps/web` triggered the *root* `package.json`'s build script (`turbo run build`). Turborepo then executed but only built the `@squire/extension` package, not the `web` package. Consequently, the `apps/web/.next` directory was not generated.

## Attempt 2: Use `$(npm bin)/next build`

**Change:**
From: `"buildCommand": "cd apps/web && npm install && npm run build"`
To: `"buildCommand": "cd apps/web && npm install && $(npm bin)/next build"`

**Result:**
- Build failed with `sh: Unknown: command not found` and exit code 127.
- **Analysis:** The Vercel build environment's shell (`sh`) did not correctly interpret or execute the command resulting from the `$(npm bin)` substitution.

## Attempt 3: Use `npx --no-install next build`

**Change:**
From: `"buildCommand": "cd apps/web && npm install && $(npm bin)/next build"`
To: `"buildCommand": "cd apps/web && npm install && npx --no-install next build"`

**Result:**
- Build failed with `npm error npx canceled due to missing packages and no YES option: ["next@15.3.1"]`.
- **Analysis:** Despite the `--no-install` flag, `npx` in the Vercel environment still attempted to fetch the latest `next` version instead of using the locally installed one. This likely points to an issue with PATH resolution or `npx` behavior in the Vercel build container when invoked this way.

## Attempt 4: Simplify `vercel.json` (Rely on Vercel defaults)

**Change (`vercel.json`):**
- Removed `"buildCommand"`.
- Removed `"installCommand"`.
- Kept `"framework": "nextjs"`, `"outputDirectory": "apps/web/.next"`.
- Ensured Vercel UI "Root Directory" was set to `./` (monorepo root).

**Result:**
- Build failed with `Error: The file "/vercel/path0/apps/web/.next/routes-manifest.json" couldn't be found.`
- **Analysis:** Vercel defaulted to running `npm run build` at the root, which executed `turbo run build`. However, the Turborepo execution log showed `Packages in scope: @squire/extension`, indicating it completely ignored the `web` package. `apps/web/package.json` was confirmed to have the correct `"name": "web"` field. Therefore, Vercel's default invocation of `turbo run build` in this project context does not correctly target the specific `web` application for deployment.

## Attempt 5: Use `turbo run build --filter=web...`

**Change (`vercel.json`):**
- Added `"buildCommand": "turbo run build --filter=web..."`
- Kept `"framework": "nextjs"`.
- Kept `"outputDirectory": "apps/web/.next"`.

**Result:**
- Build failed with `x No package found with name 'web' in workspace` and `Error: Command "turbo run build --filter=web..." exited with 1`.
- **Analysis:** Even with an explicit filter targeting the `web` package (which exists and is named correctly in `apps/web/package.json`), Turborepo failed to find the workspace within the Vercel build environment. This could be related to issues mentioned in [Turborepo Discussion #8514](https://github.com/vercel/turborepo/discussions/8514) regarding workspace detection in CI/Docker environments, potentially involving path resolution or specific Turborepo/package manager version interactions. The root `package.json` workspaces definition (`apps/*`) appears correct.

## Current Hypothesis

The Turborepo filter syntax `--filter=web...` might be interpreted incorrectly or is incompatible with how workspaces are resolved in the Vercel build environment for this project. Alternatively, there might be a subtle issue with Turborepo's workspace detection in this specific context.

## Proposed Solution (Simplify Filter)

Simplify the Turborepo filter syntax by removing the `...` which signifies dependency inclusion. Build only the target package `web` explicitly.

**Change (`vercel.json`):**
- Modify `"buildCommand"`.
- From: `"turbo run build --filter=web..."`
- To: `"turbo run build --filter=web"`

## Next Steps

1.  Apply the simplified filter change to `vercel.json`.
2.  Commit and push the change.
3.  Trigger a new Vercel deployment.
4.  Monitor the build logs. 