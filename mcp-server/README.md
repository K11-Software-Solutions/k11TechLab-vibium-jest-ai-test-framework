# Vibium MCP Server And Agent Demo

This folder pair demonstrates a simple agentic browser automation setup:

- `mcp-server/vibium-mcp-server.ts`
  A real stdio MCP server built with the official Model Context Protocol TypeScript SDK.

- `agent/run-vibium-agent.mjs`
  A goal-driven AI agent that connects to the MCP server, exposes its tools to an OpenAI model, and executes tool calls through Vibium.

## What This Demo Shows

It demonstrates the relationship between three layers:

1. **The agent**
   Understands a user goal and decides which browser action to take next.

2. **The MCP server**
   Exposes Vibium-backed browser actions as structured tools.

3. **Vibium**
   Performs the actual browser automation.

## Included MCP Tools

The server exposes these tools:

- `navigate`
- `get_page_info`
- `read_page_text`
- `click_selector`
- `click_text`
- `find_text`
- `screenshot`
- `close_browser`

## Run The MCP Server Directly

```bash
npx tsx mcp-server/vibium-mcp-server.ts
```

This starts the MCP server over stdio for local clients.

## Run The Agent Demo

Set your OpenAI configuration in `.env` or in the shell.

Example `.env` values:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1/responses
```

Then run:

```bash
node agent/run-vibium-agent.mjs "Open the K11 homepage and verify the contact page is reachable."
```

## Example Agent Flow

A typical run looks like this:

1. The agent receives a goal
2. It lists available MCP tools
3. The model chooses a tool call such as `navigate`
4. The agent executes that tool through the MCP client
5. The tool result is sent back to the model
6. The model decides the next tool call
7. Once the goal is complete, the model returns a final summary

## End-To-End Demo Walkthrough

Use this sequence when you want to show the full agentic flow in a demo:

1. Start the MCP server
2. Run the agent with a simple browser goal
3. Let the agent navigate, inspect the page, and click through with MCP tools
4. Capture a screenshot from the tool layer if you want a visual artifact
5. Show the final agent summary

### Suggested Demo Goal

```bash
node agent/run-vibium-agent.mjs "Open the K11 homepage and verify the contact page is reachable."
```

### Suggested Screenshot Moment

A good screenshot point is right after the agent has:

- called `navigate`
- found the contact link
- clicked the contact link
- returned the current page info

If you want a saved artifact during the demo, ask the agent to include a screenshot goal such as:

```text
Open the K11 homepage, verify the contact page is reachable, and save a screenshot.
```

## Example Agent Output

A typical final response from the agent may look like this:

```text
I opened the K11 homepage, found the Contact link, clicked it, and verified that the browser reached the contact page successfully. The final URL included /contact, so the goal was completed.
```

## Demo Talking Track

You can describe the flow like this during a demo:

- the user provides a goal, not step-by-step browser code
- the agent chooses from MCP-exposed browser tools
- the MCP server translates those tool calls into Vibium actions
- Vibium performs the actual browser automation
- the model uses tool results to decide the next action until the goal is complete

This makes the browser session observable, tool-driven, and reusable for larger agent workflows.
## Why This Matters

This is a practical example of how AI agents can automate browsers through tool interfaces instead of ad hoc browser code.

That makes the automation:

- more structured
- easier to observe
- easier to reuse
- easier to plug into larger agent workflows


