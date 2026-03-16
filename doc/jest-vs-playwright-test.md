# Jest vs Playwright Test

This framework currently uses Jest as the main test runner with Vibium for browser automation.

If you are considering an alternative, Playwright Test is the most relevant comparison because it is also designed for test automation workflows, but with stronger built-in browser-test primitives.

## Current Fit: Why Jest Works Here

Jest is a good fit for this repo because it runs multiple test types under one runner:

- UI tests
- API tests
- DB integration tests
- device and responsive checks
- Lighthouse checks
- AI-generated starter tests

It also works well with the current shared setup pattern in
`src/k11-platform/hooks/vibiumSetup.ts`, where page objects are created once and reused by tests.

## Where Playwright Test Would Be Stronger

Playwright Test would be stronger if the framework becomes more browser-centric.

It gives you built-in support for:

- fixtures instead of manual `beforeAll` / `afterAll` setup
- retries per test
- projects for browser/device matrices
- traces, videos, and screenshots on failure
- richer browser-focused reporting
- first-class parallel execution controls

These are all areas where Jest can work, but only with more custom framework code.

## Main Difference In Practice

With Jest in this repo:

- browser lifecycle is manual
- shared objects come from `setupVibium()`
- reports are customized through `scripts/jest-root-report.cjs`
- timeouts and retries are handled explicitly in tests

With Playwright Test style architecture:

- fixtures usually inject `page`, helpers, and setup
- browser orchestration is native to the runner
- device projects are configuration-driven
- failure artifacts are easier to standardize

## Why Not Switch Immediately

This repo is already stable on Jest, and Jest is helping keep API, DB, Lighthouse, and UI coverage in one place.

Switching to Playwright Test would make the most sense only if one of these becomes true:

1. UI/browser automation becomes the clear primary focus
2. fixture-driven architecture becomes more valuable than a shared-hook approach
3. you want stronger native support for retries, traces, and multi-project execution

## Recommendation For This Repo

- Stay with Jest if you want one simple runner across all current test layers
- Consider Playwright Test if the framework grows into a UI-first automation platform

## Simple Rule Of Thumb

- Jest = better for mixed automation in one runner
- Playwright Test = better for advanced browser-test architecture
