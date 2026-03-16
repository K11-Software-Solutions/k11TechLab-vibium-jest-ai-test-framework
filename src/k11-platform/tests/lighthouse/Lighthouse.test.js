const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

function runLighthouse(targetUrl, cfg, label) {
  const runnerPath = path.join(__dirname, 'runLighthouse.mjs');

  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [runnerPath, targetUrl, label, JSON.stringify(cfg)],
      { cwd: process.cwd(), timeout: 180000, maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {
        if (error) {
          error.message = `${error.message}\n${stderr || stdout}`;
          reject(error);
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          parseError.message = `${parseError.message}\n${stdout}\n${stderr}`;
          reject(parseError);
        }
      },
    );
  });
}

describe('Lighthouse: homepage', () => {
  jest.setTimeout(180000);

  const targetUrl = 'https://k11softwaresolutions.com';
  const baseConfig = { extends: 'lighthouse:default' };

  it('should generate a desktop Lighthouse report', async () => {
    const desktopConfig = {
      ...baseConfig,
      settings: {
        formFactor: 'desktop',
        emulatedFormFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
        },
      },
    };

    const result = await runLighthouse(targetUrl, desktopConfig, 'k11-homepage-desktop');

    expect(fs.existsSync(result.outPath)).toBe(true);
    expect(fs.existsSync(result.jsonOutPath)).toBe(true);
    expect(result.perfScore).toBeGreaterThanOrEqual(0);
  }, 180000);

  it('should generate a mobile Lighthouse report', async () => {
    const mobileConfig = {
      ...baseConfig,
      settings: {
        formFactor: 'mobile',
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 915,
          deviceScaleFactor: 2,
        },
      },
    };

    const result = await runLighthouse(targetUrl, mobileConfig, 'k11-homepage-mobile');

    expect(fs.existsSync(result.outPath)).toBe(true);
    expect(fs.existsSync(result.jsonOutPath)).toBe(true);
    expect(result.perfScore).toBeGreaterThanOrEqual(0);
  }, 180000);
});
