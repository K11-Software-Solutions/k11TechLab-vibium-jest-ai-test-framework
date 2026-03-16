import { browser } from 'vibium';

/**
 * Utility class for custom waits on UI elements.
 */
export class WaitUtil {

  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  /**
   * Wait for a locator or selector to reach a specific state.
   * @param locator Locator or selector string
   * @param state 'visible' | 'hidden' | 'attached' | 'detached' | 'enabled' | 'disabled'
   * @param timeout Timeout in ms (default 5000)
   */
  async waitForState(
    locator: string,
    state: `visible` | `hidden` | `attached` | `detached` | `enabled` | `disabled`,
    timeout: number = 5000
  ): Promise<void> {
    const element = this.page.find({ id: locator });
    switch (state) {
      case `visible`:
      case `hidden`:
      case `attached`:
      case `detached`:
        await element.waitFor({ state, timeout });
        break;
      case `enabled`:
        await element.waitFor({ state: `visible`, timeout });
        await this.page.waitForFunction((el: Element) => !el.hasAttribute(`disabled`), await element.elementHandle(), { timeout });
        break;
      case `disabled`:
        await element.waitFor({ state: `visible`, timeout });
        await this.page.waitForFunction((el: Element) => el.hasAttribute(`disabled`), await element.elementHandle(), { timeout });
        break;
      default:
        throw new Error(`Unsupported wait state: ${state}`);
    }
  }

      /**
     * Wait for the page to load completely (document.readyState === 'complete').
     */
    async waitForPageLoad(timeout: number = 10000): Promise<void> {
      await this.page.waitForFunction(() => document.readyState === `complete`, undefined, { timeout });
    }

    /**
     * Wait for specific text to appear anywhere in the page.
     */
    async waitForText(text: string, timeout: number = 5000): Promise<void> {
      await this.page.waitForSelector(`text=${text}`, { timeout });
    }

    /**
     * Wait for network to be idle (no ongoing requests).
     */
    async waitForNetworkIdle(timeout: number = 10000): Promise<void> {
      await this.page.waitForLoadState(`networkidle`, { timeout });
    }
}
