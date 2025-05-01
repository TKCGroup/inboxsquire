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

## Current Hypothesis (Revised)

Running `npm run build` within the `apps/web` directory during the Vercel build process is being intercepted by the root `package.json`'s scripts, causing `turbo run build` to run from the monorepo root. This root execution context fails to correctly identify and build the `web` application specifically for the deployment, leading to missing build artifacts.

## Proposed Solution (Revised)

Modify the `buildCommand` in `vercel.json` to *directly* execute the `next build` command using the locally installed `next` binary within the `apps/web` directory. This bypasses the root `npm run build` script and ensures only the web app is built using its correct dependencies.

**Change:**
From: `"buildCommand": "cd apps/web && npm install && npm run build"`
To: `"buildCommand": "cd apps/web && npm install && $(npm bin)/next build"`


## Next Steps

1.  Apply the revised change to `vercel.json`.
2.  Commit and push the change.
3.  Trigger a new Vercel deployment.
4.  Monitor the build logs. 