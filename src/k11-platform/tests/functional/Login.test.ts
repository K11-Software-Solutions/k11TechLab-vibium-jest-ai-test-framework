import * as path from 'path';
import DataProvider from '../../../utils/DataProvider';
import { debugLog } from '../../../utils/DebugLogger';
import { setupVibium, teardownVibium, page, login } from '../../hooks/vibiumSetup';

const csvPath = path.join(__dirname, '../../testdata/login_data.csv');
const rows = DataProvider.fetchDataFromCsv(csvPath);
jest.setTimeout(120000);

beforeAll(async () => {
    await setupVibium();
}, 30000);

afterAll(async () => {
    await teardownVibium();
}, 30000);

describe('Login CSV Data Driven', () => {
    beforeEach(async () => {
        await login.goto();
    }, 30000);

    for (const row of rows) {
        const { testName, username, password, expected } = row;
        it(`${testName} (${username})`, async () => {
            debugLog(`[login-test] starting: ${testName} (${username}), expected=${expected}`);
            debugLog('[login-test] current url before login:', await page.url());
            if ((expected || '').toLowerCase() === 'success') {
                await login.loginWithWait(username, password, 15000);
                const url = await page.url();
                debugLog('[login-test] url after successful login attempt:', url);
                expect(url).toContain('dashboard');
                const safeName = `${testName}_${username}`.replace(/[^a-z0-9-_]/gi, '_');
                const screenshotPath = `artifacts/screenshots/${safeName}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
            } else {
                await login.login(username, password);
                const url = await page.url();
                debugLog('[login-test] url after invalid login attempt:', url);
                await login.verifyLoginVisible();
                expect(url).toContain('/login');
                expect(url).not.toContain('dashboard');
            }
        }, 30000);
    }
});
