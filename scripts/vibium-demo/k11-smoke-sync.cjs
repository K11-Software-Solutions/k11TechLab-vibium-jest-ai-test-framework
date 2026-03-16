const fs = require("node:fs");
const path = require("node:path");
const { browser } = require("vibium/sync");

const url = process.env.K11_URL || "https://selenium.dev";
const artifactsDir = "artifacts/screenshots";
const homeShot = path.join(artifactsDir, "selenium-home-sync.png");
const clickShot = path.join(artifactsDir, "selenium-after-click-sync.png");

fs.mkdirSync(artifactsDir, { recursive: true });

const bro = browser.start();

try {
  const page = bro.page();
  page.go(url);

  fs.writeFileSync(homeShot, page.screenshot({ full_page: false, clip: { x: 0, y: 0, width: 400, height: 300 } }));

  const firstLink = page.find("a");
  if (firstLink) {
    firstLink.click();
    fs.writeFileSync(clickShot, page.screenshot({ full_page: false, clip: { x: 0, y: 0, width: 400, height: 300 } }));
    console.log(`[vibium-demo] Click step completed. Screenshot saved: ${clickShot}`);
  }

  console.log(`[vibium-demo] Sync smoke check completed for ${url}`);
  console.log(`[vibium-demo] Screenshot saved: ${homeShot}`);
} finally {
  bro.stop();
}
