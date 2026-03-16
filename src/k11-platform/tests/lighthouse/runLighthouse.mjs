import fs from 'fs';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

const commonChromeFlags = [
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--ignore-certificate-errors',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-web-security',
  '--disable-blink-features=AutomationControlled',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
];

const customUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 K11Lighthouse/1.0';

const targetUrl = process.argv[2];
const label = process.argv[3];
const configJson = process.argv[4];

if (!targetUrl || !label || !configJson) {
  console.error('Usage: node runLighthouse.mjs <url> <label> <configJson>');
  process.exit(1);
}

const cfg = JSON.parse(configJson);
const chrome = await launch({
  chromeFlags: [...commonChromeFlags, `--user-agent=${customUserAgent}`],
});

try {
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  cfg.settings = cfg.settings || {};
  cfg.settings.emulatedUserAgent = customUserAgent;

  const result = await lighthouse(targetUrl, options, cfg);
  const html = result.report;

  if (!fs.existsSync('artifacts/lighthouse')) {
    fs.mkdirSync('artifacts/lighthouse', { recursive: true });
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = `artifacts/lighthouse/${label}-${ts}.html`;
  const jsonOutPath = outPath.replace('.html', '.json');
  const perfScore = Math.round((result.lhr?.categories?.performance?.score ?? 0) * 100);

  fs.writeFileSync(outPath, html);
  fs.writeFileSync(jsonOutPath, JSON.stringify(result.lhr, null, 2));

  process.stdout.write(
    JSON.stringify({
      outPath,
      jsonOutPath,
      perfScore,
    }),
  );
} finally {
  await chrome.kill();
}
