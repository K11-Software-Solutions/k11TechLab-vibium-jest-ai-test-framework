# Framework Enhancements

This framework is in a strong publishable state, and the next upgrades should focus on maintainability rather than basic capability.

## Recommended Next Improvements

1. Reduce debug logging noise
   Replace always-on `console.log` tracing in page objects with a small debug logger so normal runs stay clean.

2. Standardize page-object contracts
   Keep a consistent `goto()`, `verify...Visible()`, and action-method pattern across all page objects so generators and contributors can rely on one shape.

3. Add shared test utilities
   Move repeated setup such as `jest.setTimeout(120000)` and artifact naming into shared helpers to reduce copy-paste.

4. Add environment profiles
   Support `dev`, `qa`, and `prod` config profiles so the same suite can target multiple environments safely.

5. Add selective retry strategy
   Add light retry only around known flaky UI boundaries like first navigation and live-form submission, not around all assertions.

6. Add richer artifact capture on failure
   Save screenshot, URL, and title automatically in a Jest hook for failed UI tests.

7. Add CI-ready reporters
   The custom root reports are useful locally; adding JUnit XML would make CI pipelines simpler.

8. Add generator governance
   Generated tests should be marked clearly and ideally pass through lint/review before being treated as maintained coverage.

## Implemented In This Pass

- Added an AI-assisted test generator script at `scripts/ai/generate-test.mjs`
- Added a fallback mode so generation still works without an OpenAI API key
- Added documentation for usage in `doc/ai-test-generator.md`

## Why This Generator Approach Fits The Repo

- It reuses existing Vibium setup instead of inventing a parallel framework
- It reads actual page-object methods before generating tests
- It falls back to a repo-aware local template when API access is unavailable
- It outputs Jest-recognized test files directly into the existing test tree
