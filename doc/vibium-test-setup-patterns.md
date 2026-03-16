# Vibium Test Setup Strategies: Shared vs Single Page Instantiation

This document explains the pros and cons of two common Vibium test setup patterns for CI/CD and local development.

---

## 1. Shared Setup File (Centralized Instantiation)

**Pattern:**
- All page objects and utilities are instantiated in a shared setup file (e.g., `hooks/vibiumSetup.ts`).
- Setup and teardown logic is centralized.
- Instances are exported for use in multiple test files.

**Advantages:**
- Reduces boilerplate in test files.
- Promotes reuse of page objects/utilities.
- Ensures consistent test environment across suite.
- Easier to manage complex test suites.

**Disadvantages:**
- Tests may share state if not managed carefully.
- Less isolation between tests (can lead to cross-test dependencies).
- May increase resource usage for parallel CI/CD runs.

**Example:**
```ts
// hooks/vibiumSetup.ts
import { browser } from 'vibium';
import { HomePage } from '../pageObjects/HomePage';
// ...other imports

let bro, page, home, tables, forms, login, locators;

export async function setupVibium() {
  bro = await browser.start();
  page = await bro.page();
  home = new HomePage(page);
  // ...instantiate others
}

export async function teardownVibium() {
  await bro?.stop();
}

export { bro, page, home, tables, forms, login, locators };
```

---

## 2. Single Page Instantiation Per Test

**Pattern:**
- Each test file (or test) creates its own browser/page and page objects.
- Setup and teardown are handled locally in each test.

**Advantages:**
- Maximum isolation between tests.
- Reduces risk of cross-test contamination.
- Lower resource usage for simple/parallel CI/CD runs.
- Easier debugging of individual tests.

**Disadvantages:**
- More boilerplate in each test file.
- Less reuse of shared utilities.
- May be less efficient for large suites.

**Example:**
```ts
import { browser } from 'vibium';
import { HomePage } from './pageObjects/HomePage';

let bro, page, home;

beforeAll(async () => {
  bro = await browser.start();
  page = await bro.page();
  home = new HomePage(page);
});

afterAll(async () => {
  await bro.stop();
});

// ...tests
```

---

## Choosing the Right Pattern

- **Shared setup:** Use for large, complex suites where reuse and consistency are important.
- **Single page per test:** Use for lightweight, isolated, or highly parallel CI/CD runs.

**Summary:**
Both patterns are valid in Vibium. Choose based on your project scale, CI/CD needs, and test isolation requirements.
