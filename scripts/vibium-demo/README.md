# Vibium Demo

This folder contains small Vibium examples that show how Vibium can be used as open-source browser automation for both **AI agents and humans**.

Vibium is interesting because it can be approached through multiple interfaces:

- a **CLI** for direct terminal-based browser automation
- an **MCP server** for agentic tool use
- a **programmable API / SDK** for TypeScript, JavaScript, and Python automation flows

These examples focus on the programmable API side, while still fitting into the bigger Vibium story.

## Why This Demo Exists

A lot of browser automation demos only show one mode of use.

This demo is meant to show a broader picture:

- humans can automate through commands and scripts
- AI agents can automate through tool interfaces like MCP
- engineers can build reusable frameworks on top of Vibium APIs

That makes Vibium a useful fit for both direct automation tasks and AI-assisted automation workflows.

## Included Examples

### `k11-smoke-async.mjs`
Node.js async Vibium API example.

What it does:
- starts a browser
- opens a page
- navigates to `K11_URL` or `https://selenium.dev`
- captures a screenshot
- saves the screenshot to `artifacts/screenshots/`

### `k11-smoke-sync.cjs`
Node.js sync Vibium API example.

What it does:
- starts a browser with the sync API
- navigates to `K11_URL` or `https://selenium.dev`
- captures a screenshot
- clicks the first link when available
- saves before/after screenshots

### `k11_smoke.py`
Python Vibium example.

What it demonstrates:
- using Vibium from Python for a lightweight smoke scenario

### `record-flow.ts`
Minimal recorded-style flow example in TypeScript.

What it does:
- opens a page
- navigates to `https://example.com`
- interacts with a link
- shows how to add artifacts such as screenshots

### `vibium_test.py`
Additional Python helper/demo script for experimentation.

## Example: Agentic Tool Use Through MCP

An AI agent can use MCP by calling browser capabilities as structured tools instead of writing raw browser code itself.

A simple example flow looks like this:

1. Goal: Verify the homepage contact link works
2. Tool call: navigate to https://k11softwaresolutions.com
3. Tool call: find the contact link
4. Tool call: click the contact link
5. Tool call: read the current URL
6. Tool call: confirm the URL contains /contact

In that model:

- the **agent** decides what action to take next
- the **MCP server** exposes browser actions as tools
- **Vibium** performs the actual browser automation underneath

That means the agent is not directly driving the browser with ad hoc code. It is reasoning over tool calls and using structured inputs and outputs such as:

- URLs
- selectors or element queries
- visible text
- page state
- screenshots

This makes browser automation more controllable and easier to integrate into larger AI workflows.
## What This Demonstrates About Vibium

These examples highlight Vibium as:

- **browser automation for humans**
  You can run scripts directly and inspect results quickly.

- **browser automation for AI agents**
  The same browser actions can fit into an agent workflow through tool-driven interaction patterns.

- **browser automation for framework builders**
  Vibium can sit underneath a larger automation framework, like the Jest + page-object framework in this repo.

## How This Connects To The Main Framework

The main project uses Vibium in a more structured way through:

- shared setup in `src/k11-platform/hooks/vibiumSetup.ts`
- page objects in `src/k11-platform/pageObjects/`
- Jest-based test layers in `src/k11-platform/tests/`

This `vibium-demo` folder is intentionally simpler.

Think of it as the lightweight entry point before the full framework abstraction.

## Prerequisites

- Node.js 18+
- Python 3.9+
- project dependencies installed with `npm install`
- optional Python dependencies installed with `python -m pip install -r requirements.txt`

## Run The Examples

### Async Node demo

```bash
npm run vibium:k11:async
```

### Sync Node demo

```bash
npm run vibium:k11:sync
```

### TypeScript record-style flow

```bash
npm run vibium:record:ts
```

### Python example

```bash
python scripts/vibium-demo/k11_smoke.py
```

## Override The Target URL

You can point the demo to another site with `K11_URL`.

### PowerShell

```powershell
$env:K11_URL="https://k11softwaresolutions.com"
npm run vibium:k11:async
```

### Bash

```bash
K11_URL="https://k11softwaresolutions.com" npm run vibium:k11:async
```

## Output

Artifacts are typically written to:

- `artifacts/screenshots/`

Depending on the script, this may include:

- `selenium-home-async.png`
- `selenium-home-sync.png`
- `selenium-after-click-sync.png`




