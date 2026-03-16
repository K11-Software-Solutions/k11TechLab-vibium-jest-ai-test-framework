# Showcase Highlights

## What This Framework Demonstrates

- Jest + Vibium working together as a practical UI automation framework
- Shared browser lifecycle through `setupVibium()` and `teardownVibium()`
- Reusable page-object design for homepage, login, forms, locators, and tables
- Coverage across smoke, functional, API, DB, device, E2E, and Lighthouse testing
- Timestamped HTML and JSON reporting in `reports/`
- AI-assisted test generation with optional OpenAI integration and local fallback mode
- Cleaner demo output through opt-in debug logging via `K11_DEBUG=true`

## Tech Stack

- Jest
- Vibium
- TypeScript
- Lighthouse
- OpenAI Responses API
- SQLite

## Good Demo Angles

### 1. Mixed test coverage in one framework
Show that the same repo handles browser, API, DB, device, and performance checks.

### 2. Shared setup + page objects
Highlight the maintainability benefit of central setup and reusable page models.

### 3. AI-assisted test authoring
Show how the generator can create a starter test from a plain-English goal.

### 4. Reporting and artifacts
Use the timestamped HTML/JSON reports and screenshots as proof of execution quality.

## Suggested Demo Sequence

1. Show the README architecture section
2. Run `npm run test:smoke`
3. Open the generated HTML report from `reports/`
4. Run `npm run ai:generate:test -- --page-object HomePage --goal "Verify the hero and navigate to services" --run`
5. Show the generated test file in `src/k11-platform/tests/generated/`
6. Show the report and screenshot artifacts

## Nice Screenshots For Sharing

- README architecture section
- `reports/` folder with timestamped outputs
- a clean smoke test pass in terminal
- the AI generator command and generated test file
- Lighthouse report output in `artifacts/lighthouse/`
