import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const DEFAULT_K11_URL = "https://k11softwaresolutions.com/";
const agentReportsDir = path.join(repoRoot, "reports", "ai-agent");

function loadEnvFile() {
  const envPath = path.join(repoRoot, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function debugEnabled() {
  return process.env.K11_DEBUG === "true" || process.env.AGENT_DEBUG === "true";
}

function debugLog(...args) {
  if (debugEnabled()) {
    console.log("[agent-debug]", ...args);
  }
}

function extractText(response) {
  if (response.output_text) {
    return response.output_text;
  }

  const texts = [];
  for (const item of response.output || []) {
    if (item.type === "message") {
      for (const content of item.content || []) {
        if (content.type === "output_text" || content.type === "text") {
          texts.push(content.text || "");
        }
      }
    }
  }

  return texts.join("\n").trim();
}

function normalizeToolOutput(result) {
  return {
    isError: !!result.isError,
    structuredContent: result.structuredContent ?? null,
    content: (result.content || []).map((item) => ({
      type: item.type,
      text: item.type === "text" ? item.text : JSON.stringify(item),
    })),
  };
}

async function createResponse(body) {
  const response = await fetch(process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function printMissingConfigGuidance() {
  console.log("OpenAI configuration is missing for the agent demo.");
  console.log("");
  console.log("Create a .env file in the repo root based on .env.example and set:");
  console.log("OPENAI_API_KEY=your_key_here");
  console.log("OPENAI_MODEL=gpt-4.1-mini");
  console.log("OPENAI_BASE_URL=https://api.openai.com/v1/responses");
  console.log("");
  console.log("Then rerun:");
  console.log('npm run agent:run -- "Open the K11 homepage and verify the contact page is reachable."');
}

function sanitizeFileSegment(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "agent-run";
}

function buildTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtmlReport(report) {
  const toolRows = report.toolCalls
    .map(
      (toolCall) => `
        <tr>
          <td>${escapeHtml(toolCall.step)}</td>
          <td>${escapeHtml(toolCall.name)}</td>
          <td><pre>${escapeHtml(JSON.stringify(toolCall.arguments, null, 2))}</pre></td>
          <td><pre>${escapeHtml(JSON.stringify(toolCall.result, null, 2))}</pre></td>
        </tr>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(report.name)}</title>
  <style>
    body { font-family: Segoe UI, Arial, sans-serif; margin: 24px; color: #1f2937; }
    h1, h2 { margin-bottom: 8px; }
    .meta { margin-bottom: 24px; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; }
    .status { display: inline-block; padding: 4px 10px; border-radius: 999px; font-weight: 600; background: ${report.success ? "#dcfce7" : "#fee2e2"}; color: ${report.success ? "#166534" : "#991b1b"}; }
    pre { white-space: pre-wrap; word-break: break-word; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #e5e7eb; text-align: left; vertical-align: top; padding: 10px; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  <h1>${escapeHtml(report.name)}</h1>
  <div class="meta">
    <p><strong>Status:</strong> <span class="status">${report.success ? "passed" : "failed"}</span></p>
    <p><strong>Goal:</strong> ${escapeHtml(report.goal)}</p>
    <p><strong>Timestamp:</strong> ${escapeHtml(report.timestamp)}</p>
    <p><strong>Model:</strong> ${escapeHtml(report.model)}</p>
  </div>

  <h2>Final Result</h2>
  <pre>${escapeHtml(report.result)}</pre>

  <h2>Tool Calls</h2>
  <table>
    <thead>
      <tr>
        <th>Step</th>
        <th>Tool</th>
        <th>Arguments</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      ${toolRows || '<tr><td colspan="4">No tool calls recorded.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

function writeAgentReport(report) {
  fs.mkdirSync(agentReportsDir, { recursive: true });
  const jsonPath = path.join(agentReportsDir, `${report.name}.json`);
  const htmlPath = path.join(agentReportsDir, `${report.name}.html`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(htmlPath, renderHtmlReport(report), "utf8");
  return { jsonPath, htmlPath };
}

async function main() {
  loadEnvFile();

  if (!process.env.OPENAI_API_KEY) {
    printMissingConfigGuidance();
    process.exitCode = 0;
    return;
  }

  const goal = process.argv.slice(2).join(" ") || `Open ${DEFAULT_K11_URL} and verify the contact page is reachable.`;
  const timestamp = buildTimestamp();
  const reportName = `ai-agent-${sanitizeFileSegment(goal)}-${timestamp}`;
  const toolCalls = [];
  const transport = new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["tsx", "mcp-server/vibium-mcp-server.ts"],
    cwd: repoRoot,
  });

  const client = new Client({
    name: "vibium-agent",
    version: "1.0.0",
  });

  let response;
  let finalResult = "";

  try {
    await client.connect(transport);
    const toolsResult = await client.listTools();
    debugLog("Discovered MCP tools:", toolsResult.tools.map((tool) => tool.name));

    const tools = toolsResult.tools.map((tool) => ({
      type: "function",
      name: tool.name,
      description: tool.description || `Call MCP tool ${tool.name}`,
      parameters: tool.inputSchema || { type: "object", properties: {} },
      strict: false,
    }));

    response = await createResponse({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `You are a browser automation agent. Use the provided tools to complete the user goal. Prefer using read_page_text and get_page_info to inspect state. Do not invent alternate URLs or domains. For K11 tasks, prefer ${DEFAULT_K11_URL} unless the user explicitly gives a different URL. When the goal is complete, respond with a concise summary.`,
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: goal }],
        },
      ],
      tools,
    });

    debugLog("Initial response output types:", (response.output || []).map((item) => item.type));

    for (let step = 0; step < 8; step += 1) {
      const functionCalls = (response.output || []).filter((item) => item.type === "function_call");
      debugLog(`Step ${step + 1} function calls:`, functionCalls.map((item) => item.name));
      if (functionCalls.length === 0) {
        break;
      }

      const toolOutputs = [];
      for (const toolCall of functionCalls) {
        const args = toolCall.arguments ? JSON.parse(toolCall.arguments) : {};
        debugLog(`Calling tool ${toolCall.name} with args:`, args);
        const result = await client.callTool({ name: toolCall.name, arguments: args });
        const normalized = normalizeToolOutput(result);
        debugLog(`Tool ${toolCall.name} result:`, normalized);
        toolCalls.push({
          step: step + 1,
          name: toolCall.name,
          arguments: args,
          result: normalized,
        });
        toolOutputs.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(normalized),
        });
      }

      response = await createResponse({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        previous_response_id: response.id,
        input: toolOutputs,
        tools,
      });
      debugLog(`Step ${step + 1} response output types:`, (response.output || []).map((item) => item.type));
    }

    finalResult = extractText(response);
    console.log("Agent goal:", goal);
    console.log("\nAgent result:\n");
    console.log(finalResult);

    const reportPaths = writeAgentReport({
      name: reportName,
      goal,
      timestamp,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      success: true,
      result: finalResult,
      toolCalls,
    });

    console.log("\nAgent reports:");
    console.log(path.relative(repoRoot, reportPaths.jsonPath));
    console.log(path.relative(repoRoot, reportPaths.htmlPath));
  } finally {
    await client.callTool({ name: "close_browser", arguments: {} }).catch(() => undefined);
    await transport.close().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error("Agent run failed:", error);
  const timestamp = buildTimestamp();
  const reportName = `ai-agent-failure-${timestamp}`;
  const reportPaths = writeAgentReport({
    name: reportName,
    goal: process.argv.slice(2).join(" ") || `Open ${DEFAULT_K11_URL} and verify the contact page is reachable.`,
    timestamp,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    success: false,
    result: String(error?.stack || error),
    toolCalls: [],
  });
  console.error("Agent failure reports:");
  console.error(path.relative(repoRoot, reportPaths.jsonPath));
  console.error(path.relative(repoRoot, reportPaths.htmlPath));
  process.exit(1);
});
