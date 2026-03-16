# Reporting Implementation Guide

This document explains how reporting is implemented in the framework for both Jest-based test runs and AI-agent runs.

## Reporting Overview

The framework has two reporting paths:

- **Jest test reporting** for smoke, functional, API, DB, device, E2E, Lighthouse, and generated tests
- **AI-agent reporting** for MCP-driven agent runs

Both paths follow the same general principles:

- create files automatically during the run
- store reports under the root `reports/` folder
- include timestamps in filenames
- produce machine-readable JSON and human-readable HTML

## Directory Layout

```text
reports/
|-- jest-report.json
|-- jest-report-<run-name>-<timestamp>.json
|-- jest-report-<run-name>-<timestamp>.html
|-- ai-agent/
|   |-- ai-agent-<goal-slug>-<timestamp>.json
|   |-- ai-agent-<goal-slug>-<timestamp>.html
```

## Jest Reporting

### Where It Is Wired

Jest reporting is configured in [jest.config.cjs](../jest.config.cjs).

Key part:

```js
reporters: ['default', '<rootDir>/scripts/jest-root-report.cjs']
```

This means every Jest run uses:

- the default Jest console reporter
- the custom root reporter in [jest-root-report.cjs](../scripts/jest-root-report.cjs)

### How The Custom Jest Reporter Works

The custom reporter is a class named `RootReportWriter` in [jest-root-report.cjs](../scripts/jest-root-report.cjs).

Its entry point is:

- `onRunComplete(_, results)`

Jest calls this after the full run finishes.

### What `onRunComplete()` Does

`onRunComplete()` performs these steps:

1. creates the root `reports/` folder if needed
2. builds a timestamp from `results.startTime`
3. derives a run name from the executed test file names
4. normalizes Jest results into a smaller payload object
5. writes:
   - rolling JSON report: `reports/jest-report.json`
   - timestamped JSON report
   - timestamped HTML report

### Jest Helper Functions

The reporter uses a few small helpers:

- `formatTimestamp(value)`
  Converts a time value into `YYYY-MM-DD_HH-MM-SS`

- `escapeHtml(value)`
  Escapes HTML characters before rendering the HTML report

- `slugify(value)`
  Converts text into a safe filename segment

- `deriveRunName(results)`
  Builds the run label from the suite file names
  Examples:
  - single suite: `homepage-smoke-test`
  - multiple suites: `post-jsonplaceholder-test-and-1-more`

- `buildHtmlReport(payload, timestamp)`
  Renders the HTML summary page using the normalized payload

### Jest Payload Shape

The normalized payload includes:

- overall success
- run timestamp
- suite totals
- test totals
- per-suite file path
- per-test title, status, duration, and failure messages

This payload is what gets saved to JSON and used to render HTML.

### Why There Is A Rolling JSON File

The reporter writes both:

- a timestamped JSON file for historical traceability
- `reports/jest-report.json` as a latest-run pointer

That makes it easier to integrate with local tooling or dashboards that always want the newest report path.

## AI-Agent Reporting

### Where It Is Implemented

AI-agent reporting is implemented directly inside [run-vibium-agent.mjs](../agent/run-vibium-agent.mjs).

This is separate from Jest because the agent run is a standalone Node script, not a Jest test suite.

### Report Directory

Agent reports are written to:

- [reports/ai-agent](../reports/ai-agent)

The script creates the directory automatically with:

- `fs.mkdirSync(agentReportsDir, { recursive: true })`

### AI-Agent Naming Logic

The agent report name is built from:

- the natural-language goal
- a timestamp

Important helpers:

- `sanitizeFileSegment(value)`
  Converts the goal into a filename-safe slug

- `buildTimestamp()`
  Creates the timestamp string in the same `YYYY-MM-DD_HH-MM-SS` format

A typical filename looks like:

- `ai-agent-open-the-k11-homepage-and-verify-the-contact-page-is-reachable-2026-03-15_16-54-36.html`

### AI-Agent Report Helpers

The main helpers are:

- `escapeHtml(value)`
  Escapes HTML content before building the HTML report

- `renderHtmlReport(report)`
  Builds the HTML page for the agent run

- `writeAgentReport(report)`
  Writes both JSON and HTML files to `reports/ai-agent/`

### What The Agent Report Contains

The JSON and HTML agent reports include:

- `name`
- `goal`
- `timestamp`
- `model`
- `success`
- `result`
- `toolCalls`

The `toolCalls` array stores the execution history:

- step number
- tool name
- tool arguments
- normalized tool result

This is especially useful for:

- debugging agent runs
- understanding model behavior
- demo walkthroughs
- preserving MCP tool history after the run ends

### Success And Failure Reporting

The agent reporting path handles both:

- successful runs
- failed runs

On success:

- the final model summary is written into the report
- the tool call history is preserved

On failure:

- a failure report is still written
- the error stack or message is saved into the `result` field
- the filename uses `ai-agent-failure-<timestamp>`

That means agent runs produce artifacts even when they fail.

## Relationship Between Test Artifacts And Reports

The framework separates report files from execution artifacts:

- `reports/`
  HTML and JSON summaries

- `artifacts/`
  screenshots, Lighthouse results, and demo assets

This keeps report files focused on run outcomes while leaving screenshots and performance assets in their own area.

## Why This Reporting Design Was Chosen

The reporting implementation is intentionally simple and file-based.

Benefits:

- no external reporting service required
- easy to inspect locally
- easy to upload in CI
- easy to extend later into dashboards or parsers

The structure also makes AI-agent runs feel like part of the same framework, not a separate experiment.

## Extension Ideas

Possible future improvements:

- add JUnit XML for CI tools that expect XML
- attach screenshot links inside the HTML reports
- create an index page that links all Jest and AI-agent runs
- upload `reports/` and `reports/ai-agent/` from CI workflows
- add duration and timing breakdowns to agent reports
- capture MCP server metadata in the agent report



