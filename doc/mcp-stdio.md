**MCP stdio Transport**

- **Module:** `@modelcontextprotocol/sdk/client/stdio.js`
- **Purpose:** Provides a standard input/output transport for the Model Context Protocol (MCP) client. It lets an in-process agent (the client) communicate with a spawned MCP server process over the child process's stdin/stdout streams rather than over a network socket.

**Why this is used in this framework**

- **Simplicity:** Using stdio avoids setting up network listeners and ports. The agent can spawn the MCP server locally (see [agent/run-vibium-agent.mjs](agent/run-vibium-agent.mjs)) and communicate immediately over pipes.
- **Cross-platform & CI friendly:** Stdio-based IPC works reliably across developer machines and CI environments without firewall or host configuration.
- **Process lifecycle coupling:** The transport is tied to the spawned process; when the server subprocess exits, the transport closes. This simplifies cleanup and makes agent runs deterministic.
- **Security:** No open TCP ports are required for local demos, reducing exposure surface during CI runs or demos.
- **Tooling compatibility:** The framework launches the MCP server with `npx tsx mcp-server/vibium-mcp-server.ts` and uses `StdioClientTransport` to talk to the discovered tools (see how `StdioClientTransport` is constructed in [agent/run-vibium-agent.mjs](agent/run-vibium-agent.mjs)).

**How it works (high level)**

- The agent code spawns an MCP server process (child process).
- `StdioClientTransport` wires the child's `stdin` and `stdout` to the MCP client's message framing, sending requests and receiving responses via JSON messages.
- The MCP server exposes tools (browser controls, read_page_text, etc.). The agent calls these tools as if they were local functions; the transport relays the calls and responses over stdio.

**When to use stdio vs alternatives**

- Use stdio for local demos, CI runs, and simple agent/server pairings where both sides live on the same host.
- Consider WebSocket/TCP transports if you need remote agents, multi-client access, or persistent servers that outlive a single agent process.

**Troubleshooting & tips**

- If the agent cannot discover tools, ensure the server subprocess starts successfully and writes its handshake to stdout. Run the server manually to inspect logs.
- In Windows CI, the framework already selects `npx.cmd` so subprocess invocation matches OS conventions (see `agent/run-vibium-agent.mjs`).
- Enable `K11_DEBUG=true` or `AGENT_DEBUG=true` to see transport-level logs when diagnosing framing or JSON parsing issues.

**References**

- Agent runner: [agent/run-vibium-agent.mjs](agent/run-vibium-agent.mjs)
- MCP server: [mcp-server/vibium-mcp-server.ts](mcp-server/vibium-mcp-server.ts)

