import * as fs from 'fs';
import { setupVibium, teardownVibium, forms } from '../../hooks/vibiumSetup';
import { HomePage } from '../../pageObjects/HomePage';
import { debugLog } from '../../../utils/DebugLogger';

beforeAll(async () => {
  await setupVibium();
});

afterAll(async () => {
  await teardownVibium();
});

describe('K11softwaresolutions.com Home Page UI and Navigation screenshot', () => {
  it('should load home page, capture screenshot, and test navigation', async () => {
    jest.setTimeout(120000);
    const page = forms.page;
    const home = new HomePage(page);

    await home.goto();
    debugLog('[smoke] url after goto:', await page.url());
    debugLog('[smoke] title after goto:', await page.title());
    const heroTitle = await page.find('h1');
    const isVisible = await heroTitle.isVisible();
    expect(isVisible).toBe(true);

    const screenshotPath = 'artifacts/screenshots/homepage_smoke.png';
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    fs.writeFileSync(screenshotPath, screenshotBuffer);

    await home.clickExploreServices();
    debugLog('[smoke] url after services click:', await page.url());
    await new Promise(res => setTimeout(res, 1000));
    await page.back();

    await home.clickContact();
    debugLog('[smoke] url after contact click:', await page.url());
    await new Promise(res => setTimeout(res, 1000));
    await page.back();
  }, 120000);
});
