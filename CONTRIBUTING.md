# Contributing to KOBAC Systems

Start with [the README](README.md) for setup, structure, and configuration. Use a development database; keep credentials outside Git.

## Changes and review

1. Branch from the latest `main` and keep changes focused. Preserve collaborators' work.
2. Describe the problem and resulting behavior in the commit/PR. Use Conventional Commits, for example `feat(frontend): add project presentation`.
3. Reuse design tokens and motion preferences. Preserve API calls, authentication, form submissions, navigation, and staff workflows.
4. Add real assets and source credits. Do not invent client results, metrics, testimonials, or AI responses.
5. Run `pnpm lint`, `pnpm build`, and `git diff --check`. Review narrow mobile, tablet, desktop, a short desktop viewport, keyboard navigation, and reduced motion when relevant.
6. Include screenshots or a motion preview for visual changes. Disclose unperformed checks and avoid real customer/staff data in public evidence.

## Motion checklist

- Keep native scroll, anchors, touch input, and immediate button feedback usable.
- Prefer transforms and opacity; clean up observers, timers, and listeners.
- Respect system reduced motion and the manual control. Keep every action available without animation.
- Make hover interactions work for touch and keyboard users. Keep focus visible and controls reachable.
- Reuse the installed Motion/CSS system before adding dependencies.

## Releases

Update `package.json`, the `application-version` meta tag, and `CHANGELOG.md` together. Record scope and validation in `docs/releases/`. Preserve release history.

For v1.2: release title **frontend design v1.2**, tag **v1.2**, package **1.2.0**. Verify GitHub checks and the existing Vercel deployment before reporting it live. A frontend-only release must not change backend services or production configuration.
