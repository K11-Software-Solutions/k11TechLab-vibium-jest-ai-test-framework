import { setupVibium, teardownVibium, page } from '../../hooks/vibiumSetup';
import { config } from '../../config/appconfig';

const devices = [
    { name: 'Desktop', viewport: { width: 1280, height: 800 } },
    { name: 'iPhone X', viewport: { width: 375, height: 812 } },
    { name: 'iPad', viewport: { width: 768, height: 1024 } }
];

beforeAll(async () => {
    await setupVibium();
}, 30000);

afterAll(async () => {
    await teardownVibium();
}, 30000);

describe('Device Suite: Home Page', () => {
    for (const device of devices) {
        describe(`Emulation: ${device.name}`, () => {
            beforeEach(async () => {
                await page.setViewport(device.viewport);
                await page.go(config.baseUrl);
            }, 30000);

            it('should show main header', async () => {
                const header = await page.find({ tag: 'header' });
                expect(header).toBeDefined();
                const title = await page.find({ text: 'K11 Software Solutions' });
                expect(title).toBeDefined();
            }, 30000);

            it('should show Explore Services button', async () => {
                const btn = await page.find('a[href="/services"]');
                expect(btn).toBeDefined();
                if (device.name === 'iPhone X') {
                    return;
                }
                try {
                    await btn.click();
                } catch (e) {
                    const err = e as Error;
                    console.warn('Click intercepted, possibly by overlay:', err.message || err);
                    throw err;
                }
            }, 30000);
        });
    }
});
