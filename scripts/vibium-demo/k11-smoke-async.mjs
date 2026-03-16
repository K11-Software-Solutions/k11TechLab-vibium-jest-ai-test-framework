import fs from "node:fs/promises";
import path from "node:path";
import { browser } from "vibium";

const url = process.env.K11_URL || "https://selenium.dev";
const artifactsDir = "artifacts/screenshots";
const homeShot = path.join(artifactsDir, "selenium-home-async.png");

await fs.mkdir(artifactsDir, { recursive: true });

const bro = await browser.start();

try {
  const page = await bro.page();
  await page.go(url);

  const png = await page.screenshot({ full_page: false, clip: { x: 0, y: 0, width: 400, height: 300 } });
  await fs.writeFile(homeShot, png);

  console.log(`[vibium-demo] Async smoke check completed for ${url}`);
  console.log(`[vibium-demo] Screenshot saved: ${homeShot}`);
} finally {
  await bro.stop();
}
