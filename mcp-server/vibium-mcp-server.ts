import path from "node:path";
import { createRequire } from "node:module";
import { browser } from "vibium";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

const require = createRequire(import.meta.url);

function ensureVibiumBinaryPath() {
  if (process.env.VIBIUM_BIN_PATH) {
    return;
  }

  try {
    const pkgPath = require.resolve("@vibium/win32-x64/package.json");
    process.env.VIBIUM_BIN_PATH = path.join(path.dirname(pkgPath), "bin", "vibium.exe");
  } catch {
    // Leave unset and let Vibium surface its own runtime error if missing.
  }
}

ensureVibiumBinaryPath();

const server = new McpServer({
  name: "vibium-mcp-server",
  version: "1.0.0",
});

let bro: any;
let page: any;

async function ensurePage() {
  if (!bro) {
    bro = await browser.start();
  }

  if (!page) {
    page = typeof bro.newPage === "function" ? await bro.newPage() : await bro.page();
  }

  return page;
}

async function safePageInfo() {
  const activePage = await ensurePage();
  return {
    url: await activePage.url(),
    title: await activePage.title(),
  };
}

server.registerTool(
  "navigate",
  {
    description: "Open a URL in the Vibium-controlled browser page.",
    inputSchema: {
      url: z.string().url().describe("The URL to open."),
    },
  },
  async ({ url }) => {
    const activePage = await ensurePage();
    await activePage.go(url);
    const info = await safePageInfo();

    return {
      content: [{ type: "text", text: `Navigated to ${info.url} (${info.title})` }],
      structuredContent: info,
    };
  },
);

server.registerTool(
  "get_page_info",
  {
    description: "Get the current page URL and title.",
    inputSchema: {},
  },
  async () => {
    const info = await safePageInfo();

    return {
      content: [{ type: "text", text: `URL: ${info.url}\nTitle: ${info.title}` }],
      structuredContent: info,
    };
  },
);

server.registerTool(
  "read_page_text",
  {
    description: "Read a trimmed chunk of visible text from the current page.",
    inputSchema: {
      maxChars: z.number().int().min(200).max(4000).default(1200).describe("Maximum number of characters to return."),
    },
  },
  async ({ maxChars }) => {
    const activePage = await ensurePage();
    const text = await activePage.evaluate(`(() => {
      const value = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
      return value.slice(0, ${maxChars});
    })()`);

    return {
      content: [{ type: "text", text: String(text || "") }],
      structuredContent: { text: String(text || "") },
    };
  },
);

server.registerTool(
  "click_selector",
  {
    description: "Click an element using a CSS selector.",
    inputSchema: {
      selector: z.string().min(1).describe("CSS selector to click."),
    },
  },
  async ({ selector }) => {
    const activePage = await ensurePage();
    const element = await activePage.find(selector);
    await element.click();
    const info = await safePageInfo();

    return {
      content: [{ type: "text", text: `Clicked selector ${selector}. Current URL: ${info.url}` }],
      structuredContent: { selector, ...info },
    };
  },
);

server.registerTool(
  "click_text",
  {
    description: "Click an element by visible text.",
    inputSchema: {
      text: z.string().min(1).describe("Visible text to click."),
    },
  },
  async ({ text }) => {
    const activePage = await ensurePage();
    const element = await activePage.find({ text });
    await element.click();
    const info = await safePageInfo();

    return {
      content: [{ type: "text", text: `Clicked text '${text}'. Current URL: ${info.url}` }],
      structuredContent: { text, ...info },
    };
  },
);

server.registerTool(
  "find_text",
  {
    description: "Check whether specific visible text exists on the current page.",
    inputSchema: {
      text: z.string().min(1).describe("Visible text to look for."),
    },
  },
  async ({ text }) => {
    const activePage = await ensurePage();
    try {
      await activePage.find({ text }, { timeout: 3000 });
      return {
        content: [{ type: "text", text: `Found text: ${text}` }],
        structuredContent: { found: true, text },
      };
    } catch {
      return {
        content: [{ type: "text", text: `Text not found: ${text}` }],
        structuredContent: { found: false, text },
      };
    }
  },
);

server.registerTool(
  "screenshot",
  {
    description: "Capture a screenshot to a path on disk.",
    inputSchema: {
      path: z.string().min(1).describe("Relative file path to save the screenshot."),
      fullPage: z.boolean().default(true).describe("Whether to capture the full page."),
    },
  },
  async ({ path, fullPage }) => {
    const activePage = await ensurePage();
    await activePage.screenshot({ path, fullPage });
    return {
      content: [{ type: "text", text: `Screenshot saved to ${path}` }],
      structuredContent: { path, fullPage },
    };
  },
);

server.registerTool(
  "close_browser",
  {
    description: "Close the active Vibium browser session.",
    inputSchema: {},
  },
  async () => {
    await bro?.stop();
    bro = undefined;
    page = undefined;

    return {
      content: [{ type: "text", text: "Browser closed." }],
      structuredContent: { closed: true },
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

