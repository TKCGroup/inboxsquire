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

## Current Hypothesis (Revised Again)

The Vercel `sh` environment doesn't support the `$(npm bin)` command substitution method used. However, the core issue remains needing to execute the *locally installed* `next` binary (version 14.2.15) within the `apps/web` context, without triggering the root Turborepo build or fetching the latest `next` version.

## Proposed Solution (Revised Again)

Use `npx` again, but add the `--no-install` flag. This instructs `npx` to execute the `next` command *only* if it's found in the local `node_modules/.bin` path (which it should be after `npm install`), preventing it from fetching the latest version if it can't find it locally.

**Change:**
From: `"buildCommand": "cd apps/web && npm install && $(npm bin)/next build"`
To: `"buildCommand": "cd apps/web && npm install && npx --no-install next build"`

## Next Steps

1.  Apply the latest revised change to `vercel.json`.
2.  Commit and push the change.
3.  Trigger a new Vercel deployment.
4.  Monitor the build logs. 