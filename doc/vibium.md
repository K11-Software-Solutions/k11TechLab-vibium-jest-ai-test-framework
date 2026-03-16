# Vibium Overview

Vibium is a cross-language browser automation library supporting Python and Node.js. It enables fast, reliable web automation and testing, similar to Playwright and Selenium, but with a unified API for both sync and async workflows.

## Features
- Supports Python and Node.js (sync and async)
- Automates browsers (Chrome, Chromium)
- Screenshot capture, navigation, element interaction
- Easy integration with CI/CD and test frameworks

## Installation
### Python
```
pip install vibium
```

### Node.js
```
npm install vibium @vibium/win32-x64
```

## Usage Example
### Python
```python
from vibium import browser
bro = browser.start()
page = bro.page()
page.go("https://example.com")
artifacts_dir = Path("artifacts/screenshots")
artifacts_dir.mkdir(parents=True, exist_ok=True)
png = page.screenshot()
home_shot = artifacts_dir / "example-home-python.png"
home_shot.write_bytes(png)
bro.stop()
```

### Node.js (Async)
```js
import { browser } from "vibium";
import fs from "node:fs/promises";
import path from "node:path";
const bro = await browser.start();
const page = await bro.page();
await page.go("https://example.com");
const artifactsDir = "artifacts/screenshots";
await fs.mkdir(artifactsDir, { recursive: true });
const png = await page.screenshot();
const homeShot = path.join(artifactsDir, "example-home-async.png");
await fs.writeFile(homeShot, png);
await bro.stop();
```

### Node.js (Sync)
```js
const { browser } = require("vibium/sync");
const fs = require("node:fs");
const path = require("node:path");
const bro = browser.start();
const page = bro.page();
page.go("https://example.com");
const artifactsDir = "artifacts/screenshots";
fs.mkdirSync(artifactsDir, { recursive: true });
const png = page.screenshot();
const homeShot = path.join(artifactsDir, "example-home-sync.png");
fs.writeFileSync(homeShot, png);
bro.stop();
```

## Common Issues
- Ensure the Vibium binary is installed for Node.js (@vibium/win32-x64)
- Set VIBIUM_BIN_PATH if the binary is not auto-detected
- Use small screenshot clips for heavy pages

## More Information
Visit the official Vibium documentation or GitHub for advanced usage, API reference, and troubleshooting tips.
