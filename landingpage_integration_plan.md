# Landing Page Integration Plan

This document outlines the steps to integrate the pre-built landing page from `hopper/landingpage` into the main Next.js application (`apps/web`) at the root route (`/`).

## Assumptions

- The landing page source code is in `hopper/landingpage/src`.
- The main landing page component is `hopper/landingpage/src/App.tsx`.
- Styling relies on Tailwind CSS and global CSS (`hopper/landingpage/src/index.css`).
- Icons use `lucide-react`.

## Integration Steps

1.  **Copy Components:**
    - Copy the contents of `hopper/landingpage/src/components/` into `apps/web/src/components/landing/`.
    - Create the `landing/` subdirectory to keep landing page components organized and separate from potential shared dashboard components.

2.  **Copy Main Page Component:**
    - Copy `hopper/landingpage/src/App.tsx` to `apps/web/src/app/LandingPage.tsx`.
    - Rename it to avoid conflict with `apps/web/src/app/page.tsx` initially.
    - Update internal imports within `LandingPage.tsx` to reflect the new component path (e.g., `from '@/components/landing/...'`).

3.  **Copy Global Styles:**
    - Examine `hopper/landingpage/src/index.css`.
    - Copy any necessary global styles (beyond standard Tailwind directives) into `apps/web/src/app/globals.css`.
    *Note: Ensure Tailwind directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) are present only once, likely already in `globals.css`.* 

4.  **Copy Assets (If Any):**
    - Check if `hopper/landingpage/src/` or `hopper/landingpage/public/` contains any image assets, fonts, etc.
    - Copy any such assets into `apps/web/public/`.
    - Update paths in the components if necessary (e.g., `/image.png` instead of `/src/assets/image.png`).

5.  **Update Root Page (`apps/web/src/app/page.tsx`):**
    - Modify `apps/web/src/app/page.tsx` to import and render the `LandingPage` component.
    - Remove the default Next.js boilerplate content.

6.  **Install Dependencies:**
    - Add `lucide-react` to the dependencies in `apps/web/package.json`.
    - Run `npm install` within the `apps/web` directory.

7.  **Configure Tailwind (If Necessary):**
    - Compare `hopper/landingpage/tailwind.config.js` with `apps/web/tailwind.config.ts`.
    - Merge any custom themes, plugins, or settings from the landing page config into the `apps/web` config.
    *Note: Next.js uses `.ts` for Tailwind config, Vite used `.js`.* Ensure syntax is correct for the `.ts` file.

8.  **Test:**
    - Run `npm run dev` in `apps/web`.
    - Verify the landing page renders correctly at the root URL (`/`).
    - Check styling, icons, and any interactive elements.

9.  **Cleanup:**
    - Once the integration is successful and verified, the `hopper/landingpage` directory can be safely deleted.

## Potential Issues

- **Import Paths:** Ensure all component imports within the copied files are updated correctly.
- **Tailwind Conflicts/Overrides:** Merging Tailwind configs might require careful checking.
- **Global CSS Conflicts:** Ensure styles from `index.css` don't conflict with existing global styles.
- **Environment Differences:** Vite vs. Next.js might have subtle differences in how environment variables or certain features work, though unlikely for a basic landing page. 