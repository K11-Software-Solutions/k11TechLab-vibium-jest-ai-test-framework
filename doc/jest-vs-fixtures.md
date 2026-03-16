# Why This Project Uses Jest for Tests

This project uses **Jest** as the test runner around Vibium-based browser automation.

## Short answer

Jest is used here because it gives the project a simple, familiar structure for:

- grouping tests with `describe` and `it`
- assertions with `expect(...)`
- setup and teardown with `beforeAll`, `afterAll`, and `beforeEach`
- running TypeScript test files with the current repo configuration

That fits the way this test suite is currently organized: shared setup in
[`src/k11-platform/hooks/vibiumSetup.ts`](../src/k11-platform/hooks/vibiumSetup.ts),
page objects under `src/k11-platform/pageObjects/`, and Jest-style suites under
`src/k11-platform/tests/`.

## Why Jest makes sense in this repo

### 1. The tests are organized as application tests, not just browser scripts

The suite mixes several kinds of tests:

- smoke tests
- functional UI tests
- API tests
- DB-related tests
- end-to-end flows

Jest is a good fit for that because it is a general-purpose JavaScript/TypeScript
test runner, not only a browser automation framework.

### 2. Vibium handles browser automation; Jest handles test orchestration

In this repo, Vibium is responsible for:

- launching the browser
- creating a page
- navigating
- finding and interacting with elements
- taking screenshots

Jest is responsible for:

- test lifecycle
- test grouping
- pass/fail reporting
- assertions
- running the suite from the command line

That separation keeps responsibilities clear.

### 3. The current codebase already follows Jest patterns

Examples in this repo already use:

- `beforeAll(async () => { ... })`
- `afterAll(async () => { ... })`
- `describe(...)`
- `it(...)`
- `expect(...)`

Because the suite is already built around those patterns, continuing with Jest
keeps the tests consistent and easier to maintain.

### 4. Shared setup is straightforward with Jest

This project has a shared Vibium bootstrap file:

- [`src/k11-platform/hooks/vibiumSetup.ts`](../src/k11-platform/hooks/vibiumSetup.ts)

Jest lifecycle hooks make it easy to reuse that setup:

```ts
beforeAll(async () => {
  await setupVibium();
});

afterAll(async () => {
  await teardownVibium();
});
```

That is simple and readable for a team already comfortable with common unit/integration
testing patterns.

## Jest vs fixtures

When people say "fixtures," they usually mean a framework-managed dependency injection
pattern like Playwright fixtures, where the test runner provides objects such as
`page`, `browser`, or custom helpers directly to each test.

### Jest approach in this repo

With Jest, we create and manage test dependencies ourselves:

```ts
beforeAll(async () => {
  await setupVibium();
});

it('loads the home page', async () => {
  const page = forms.page;
  const home = new HomePage(page);
  await home.goto();
});
```

Characteristics:

- explicit setup
- easy to understand
- low framework magic
- flexible for mixed test types
- responsibility for cleanup stays with us

### Fixture-based approach

A fixture-based runner usually injects test dependencies for us:

```ts
test('loads the home page', async ({ page, homePage }) => {
  await homePage.goto();
});
```

Characteristics:

- more declarative test body
- stronger per-test isolation
- cleaner dependency injection
- often better for large browser-only suites
- more framework-specific structure

## Tradeoffs

### Benefits of Jest in this project

- Works well for UI, API, DB, and utility tests in one test runner
- Keeps setup explicit and easy to trace
- Matches the code that already exists
- Reduces dependency on a browser-specific runner model

### Downsides of Jest compared with fixtures

- We manually manage shared resources and teardown
- Test isolation is easier to get wrong
- Reusing state across tests can create hidden coupling
- Dependency injection is less elegant than fixture systems

## When fixtures would be better

A fixture-heavy approach would likely be better if this project became:

- primarily browser UI automation
- highly parallel
- strongly isolated per test
- dependent on many reusable per-test resources

In that case, moving toward a fixture-oriented runner could reduce boilerplate and
improve isolation.

## Current recommendation

For this repo, Jest is still a reasonable choice because:

- the suite is mixed, not purely browser-driven
- Vibium already covers the browser automation layer
- the existing tests are already written in Jest style
- shared setup is understandable and working

If the suite grows into a larger browser-first automation platform, fixtures may
become the better long-term model. Right now, Jest is the simpler and more natural fit.
