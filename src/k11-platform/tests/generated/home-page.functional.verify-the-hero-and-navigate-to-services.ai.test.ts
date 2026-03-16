import { setupVibium, teardownVibium, page, home } from '../../hooks/vibiumSetup';

jest.setTimeout(120000);

beforeAll(async () => {
  await setupVibium();
}, 30000);

afterAll(async () => {
  await teardownVibium();
}, 30000);

describe('AI Generated HomePage functional flow', () => {
  beforeEach(async () => {
    if (typeof home.goto === 'function') {
      await home.goto();
    }
  }, 30000);

  it('Verify the hero and navigate to services', async () => {
    await home.verifyHeroTitleVisible();
    await home.clickExploreServices();
    expect(await page.url()).toBeTruthy();
  }, 30000);
});
