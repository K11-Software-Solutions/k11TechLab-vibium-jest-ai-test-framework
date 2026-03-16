import { mkdir, writeFile } from "node:fs/promises";
import { browser } from "vibium";

async function main(): Promise<void> {
  const bro = await browser.start();
  const page = await bro.page();
  await page.go("https://example.com");
  await page.find({ role: "link" }).click();
  await mkdir("artifacts", { recursive: true });
  // If you want to save a screenshot or other artifact, use page.screenshot()
  // Example:
  // const png = await page.screenshot();
  // await writeFile("artifacts/vibium-records/record.png", png);
  await bro.stop();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
