# AI Test Generator: Function Guide

This document explains each function in `scripts/ai/generate-test.mjs` and how the generator works from start to finish.

## High-Level Flow

1. Load `.env` values if a `.env` file exists
2. Parse CLI arguments such as `--page-object`, `--goal`, and `--run`
3. Read the target page object and shared Vibium setup
4. Build generation context from repo structure
5. Try OpenAI generation if credentials are available
6. Fall back to a local template if OpenAI is unavailable or fails
7. Write the generated test file
8. Optionally run the generated test with Jest
9. Print a JSON summary to the terminal

## Imports And Constants

### `fs`
Used for reading and writing files such as page objects, `.env`, and generated test files.

### `path`
Used to resolve file-system paths across the repo.

### `fileURLToPath`
Converts the current module URL into a normal filesystem path so the script can calculate the repo root.

### `spawn`
Used to optionally run the generated test with Jest when `--run` is passed.

### `repoRoot`
Calculated from the script location. This is the base path used throughout the generator.

### `pageObjectsDir`
Points to `src/k11-platform/pageObjects`, where the generator looks for page object files.

### `vibiumSetupPath`
Points to `src/k11-platform/hooks/vibiumSetup.ts`, which is used to discover shared page-object aliases like `home`, `login`, and `forms`.

## Function Reference

### `loadEnvFile()`
Reads `.env` from the repo root if it exists.

What it does:
- skips blank lines and comments
- parses `KEY=VALUE` entries
- strips wrapping single or double quotes
- does not overwrite values that are already present in `process.env`

Why it matters:
- lets the generator use `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_BASE_URL` without requiring manual export in the terminal

### `parseArgs(argv)`
Parses CLI arguments from `process.argv`.

What it supports:
- `--key value`
- `--key=value`
- boolean flags such as `--run`

Why it matters:
- keeps the generator dependency-free while still supporting a clean CLI experience

### `toSlug(value)`
Converts text into a file-safe slug.

Example:
- `Verify Hero Title` becomes `verify-hero-title`

Why it matters:
- used to create readable generated test filenames

### `toCamel(value)`
Converts a class-style name into lower camel case.

Example:
- `LoginPage` becomes `loginPage`

Why it matters:
- used as a fallback alias if the real shared alias cannot be discovered from `vibiumSetup.ts`

### `readText(filePath)`
A small helper that reads a file as UTF-8 text.

Why it matters:
- keeps repeated file reads simple and consistent

### `resolvePageObject(inputName)`
Maps a user-supplied page object name to an actual file in `src/k11-platform/pageObjects`.

What it does:
- accepts names with or without `.ts`
- accepts names with or without the `Page` suffix
- compares case-insensitively

Example:
- `HomePage`
- `home`
- `home.ts`

Why it matters:
- makes the CLI easier to use while still resolving to the correct source file

### `parseClassName(pageObjectSource, fallbackFileName)`
Extracts the exported class name from the page object source.

What it looks for:
- `export class SomePage`

Fallback behavior:
- if no exported class is found, it uses the file name

Why it matters:
- the class name becomes part of the generation context and final summary

### `parseMethods(pageObjectSource)`
Finds async methods in the page object.

What it does:
- scans for `async methodName(...)`
- excludes helper-style internals like `setInputValue` and `setSelectValue`

Why it matters:
- the generator uses these methods to decide what a generated test should call

### `resolvePageAlias(className)`
Finds the shared alias for a page object from `vibiumSetup.ts`.

What it looks for:
- declarations like `let home: HomePage;`

Fallback behavior:
- if it cannot find a match, it falls back to camel-casing the class name without `Page`

Why it matters:
- generated tests should use the actual shared alias exported by `vibiumSetup.ts`

### `resolveDefaultOutput(pageObjectName, goal, testType)`
Builds the default output path for a generated test file.

Example output:
- `src/k11-platform/tests/generated/home-page.functional.verify-the-hero.ai.test.ts`

Why it matters:
- keeps generated tests organized and readable without requiring `--output`

### `findBestMethod(methods, candidates)`
Finds the first method whose name loosely matches one of the requested candidates.

Why it matters:
- used for lightweight heuristic matching during fallback generation

### `inferActionFromGoal(methods, goal)`
Uses goal text to infer which page-object action method should be used.

Examples:
- goals mentioning `service` prefer `clickExploreServices` or `goToServices`
- goals mentioning `login` prefer `loginWithWait` or `login`
- goals mentioning `dropdown` prefer `selectDropdown`

Fallback behavior:
- if no keyword match is found, it chooses the first non-`goto`, non-`verify...` async method

Why it matters:
- this is the core heuristic that makes the local fallback generator useful

### `buildFallbackCode(context)`
Generates a TypeScript Jest test file without using OpenAI.

What it uses from `context`:
- alias
- class name
- goal
- output path
- test type
- available methods

What it generates:
- `setupVibium()` and `teardownVibium()` hooks
- `beforeEach` navigation when `goto()` exists
- one or more page-object calls inferred from the goal
- a simple assertion such as URL presence or dashboard navigation

Why it matters:
- ensures the generator still works when OpenAI is unavailable

### `generateWithOpenAI(context)`
Calls the OpenAI Responses API to generate a test using the live repo context.

What it does:
- returns early if `OPENAI_API_KEY` is missing
- uses `OPENAI_BASE_URL` and `OPENAI_MODEL` when provided
- sends a system prompt and user prompt
- uses Structured Outputs with a JSON schema
- expects a JSON result containing `summary` and `code`

Why it matters:
- gives the generator a higher-quality output path when AI generation is enabled

### `main()`
The main orchestration function for the script.

What it does in order:
1. calls `loadEnvFile()`
2. parses CLI args
3. validates required inputs
4. resolves page object and repo context
5. tries `generateWithOpenAI()`
6. falls back to `buildFallbackCode()` if needed
7. writes the generated file
8. optionally runs Jest when `--run` is passed
9. prints a JSON summary result

Why it matters:
- this is the full command lifecycle for the generator

## Runtime Result Object

At the end of execution, the generator prints a JSON object like this:

- `outputPath`
- `usedFallback`
- `summary`
- `pageObject`
- `alias`
- `methods`
- `model`
- `runRequested`
- `runSucceeded`

This makes the script easier to automate or inspect from other tooling.

## How `--run` Works

When `--run` is passed:

- the script builds the generated file first
- then it spawns a Jest command
- it waits for the child process to exit
- it stores the pass/fail status in `runSucceeded`

This means the generator can act as both:
- a code generator
- a generate-and-verify workflow helper

## Practical Summary

The generator has two modes:

### 1. OpenAI generation mode
Used when `OPENAI_API_KEY` is available.

Best for:
- richer test drafts
- goal-driven generation with more context
- more human-like test authoring

### 2. Local fallback mode
Used when OpenAI is not configured or generation fails.

Best for:
- offline usage
- predictable starter templates
- environments where AI access is optional

Together, these make the script reliable enough for daily use while still allowing smarter generation when AI is available.
