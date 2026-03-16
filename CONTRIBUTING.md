# Contributing Guidelines

Thank you for your interest in contributing to `k11TechLab-vibium-jest-ai-test-framework`.

This repository is structured as a production-style test automation framework built with Jest, Vibium, TypeScript, Lighthouse, and AI-assisted test generation. These guidelines are here to keep contributions consistent, reviewable, and easy to maintain.

## Ways To Contribute

You can contribute by:

- improving test stability
- adding new page objects or test coverage
- improving docs and examples
- enhancing reporting and CI/CD workflows
- refining AI test generation and prompts
- improving utilities, runners, or framework structure

## Project Structure

Important locations:

- `src/k11-platform/config/` for app configuration
- `src/k11-platform/hooks/` for shared Vibium lifecycle setup
- `src/k11-platform/pageObjects/` for reusable page models
- `src/k11-platform/tests/` for grouped test layers
- `src/utils/` for shared utilities
- `scripts/` for reporters, generators, and helper scripts
- `prompts/` for reusable AI generation prompts
- `ai-test-runner/` for one-click AI runner scripts
- `doc/` for framework and publishing documentation

## Contribution Principles

Please keep contributions aligned with these goals:

- prefer readable, practical framework code over clever abstractions
- preserve the shared setup + page-object pattern unless there is a strong reason to change it
- keep generated or demo-friendly outputs organized under `reports/` and `artifacts/`
- make AI features augment the framework, not bypass its structure
- avoid introducing unnecessary dependencies when a simple local solution is enough

## Setup

Install dependencies:

```bash
npm install
python -m pip install -r requirements.txt
```

Optional for AI generation:

- copy `.env.example` to `.env`
- set `OPENAI_API_KEY`

## Running Tests

Run everything:

```bash
npm test
```

Run focused suites:

```bash
npm run test:smoke
npm run test:functional
npm run test:api
npm run test:db
npm run test:devices
npm run test:e2e
npm run test:lighthouse
npm run test:ci
```

Run AI generation flows:

```bash
npm run ai:generate:test -- --page-object HomePage --goal "Verify the homepage can navigate to services"
npm run ai:runner:homepage
```

## Code Style Expectations

- Use TypeScript patterns already present in the repo
- Keep code and naming simple and descriptive
- Reuse existing helpers before adding new utility layers
- Keep page objects focused on selectors and actions
- Keep tests focused on intent and assertions
- Prefer stable assertions over overly brittle ones
- Avoid noisy `console.log` output in normal test flow; use the debug logger pattern where needed

## Page Object Guidelines

When adding or updating page objects:

- prefer lazy getters or action methods over eager element lookup in constructors
- keep selectors centralized in the page object
- add clear `goto()` and `verify...()` methods when appropriate
- avoid leaking low-level DOM mechanics into test files unless absolutely necessary

## Test Guidelines

When adding tests:

- place them in the correct test layer folder
- use `setupVibium()` and `teardownVibium()` for UI flows
- reuse shared page-object instances from `vibiumSetup.ts` when possible
- keep one test focused on one behavior or flow
- capture artifacts only when they add value

## AI Generator Contributions

If you change `scripts/ai/generate-test.mjs`:

- preserve both OpenAI mode and fallback mode
- keep generated output compatible with the current Jest + Vibium setup
- avoid hardcoding assumptions that only work for one page object
- update related docs in `doc/` and prompts in `prompts/` when behavior changes

## Documentation Contributions

Documentation updates are welcome and encouraged.

Please update docs when you change:

- framework structure
- runner behavior
- environment setup
- AI generator behavior
- CI/CD workflows
- reporting behavior

## Pull Request Guidance

For a clean review, please include:

- what changed
- why it changed
- which tests were run
- any limitations, assumptions, or follow-up work

A good small PR is better than a large mixed PR.

## What To Avoid

Please avoid:

- unrelated formatting churn
- renaming large parts of the repo without strong justification
- adding dependencies for minor helper behavior
- bypassing shared setup patterns without explanation
- committing generated reports or artifacts unless explicitly needed for documentation

## Suggested Future Contribution Areas

Good next areas for contributors include:

- stronger failure artifact hooks
- richer CI coverage
- stricter typing in utilities and page objects
- improved AI prompt libraries
- additional generated test templates
- accessibility automation support

## Questions And Collaboration

If you are unsure where to start, a good first contribution is usually one of these:

- improve a doc
- add a focused test
- improve a page object method
- add a prompt or runner preset
- improve CI workflow clarity

Thanks for helping improve the framework.
