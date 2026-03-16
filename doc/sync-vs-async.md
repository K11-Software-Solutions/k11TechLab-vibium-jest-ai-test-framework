# Why Sync and Async Modes Matter in Vibium

## Overview
Vibium offers both synchronous (sync) and asynchronous (async) APIs for browser automation in Node.js and Python. This flexibility is important for adapting to different application architectures, coding styles, and performance needs.

## Async Mode
- **Non-blocking:** Async mode allows multiple operations to run concurrently, improving efficiency for tasks like web scraping, testing, or interacting with many pages at once.
- **Scalable:** Ideal for modern applications, servers, and test runners that need to handle many browser sessions or requests simultaneously.
- **Integration:** Works well with frameworks and libraries that use async/await, Promises (Node.js), or asyncio (Python).

## Sync Mode
- **Simplicity:** Sync mode is easier to use for simple scripts, quick tests, or automation tasks where concurrency is not needed.
- **Legacy Support:** Useful for older codebases or environments that do not support async/await or Promises.
- **Debugging:** Step-by-step execution is often easier to debug and reason about in sync mode.

## When to Use Each
- **Async:** Use when you need high performance, concurrency, or integration with async frameworks.
- **Sync:** Use for simple, linear scripts, quick automation, or when async is not supported.

## Example
### Async (Node.js)
```js
import { browser } from "vibium";
const bro = await browser.start();
const page = await bro.page();
await page.go("https://example.com");
const png = await page.screenshot();
await bro.stop();
```

### Sync (Node.js)
```js
const { browser } = require("vibium/sync");
const bro = browser.start();
const page = bro.page();
page.go("https://example.com");
const png = page.screenshot();
bro.stop();
```

## Summary
Sync and async modes let you choose the best approach for your project, balancing simplicity and scalability. Vibium’s dual API ensures compatibility with a wide range of use cases and developer preferences.
