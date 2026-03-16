import * as path from 'path';
import * as fs from 'fs';
import DataProvider from '../../../utils/DataProvider';
import { setupVibium, teardownVibium, page, login } from '../../hooks/vibiumSetup';

const csvPath = path.join(__dirname, '../../testdata/e2e_login_data.csv');
const rows = DataProvider.fetchDataFromCsv(csvPath);
jest.setTimeout(120000);

beforeAll(async () => {
  await setupVibium();
}, 30000);

afterAll(async () => {
  await teardownVibium();
}, 30000);

describe('E2E: login using UI and validate dashboard', () => {
  for (const { username, password } of rows) {
    it(`should login via UI and validate dashboard (${username})`, async () => {
      await login.goto();
      await login.loginWithWait(username, password, 15000);
      const url = await page.url();
      expect(url).toContain('dashboard');

      const dashboardHeading = await page.find({ tag: 'h1', text: 'Dashboard' }, { timeout: 15000 });
      const isVisible = await dashboardHeading.isVisible();
      expect(isVisible).toBe(true);

      const e2eRespDir = path.join(__dirname, '../../apiResponses');
      if (!fs.existsSync(e2eRespDir)) {
        fs.mkdirSync(e2eRespDir);
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(e2eRespDir, `e2e_${username}_${timestamp}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }, 30000);
  }
});
