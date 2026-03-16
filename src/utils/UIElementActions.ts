import { browser } from 'vibium';

/**
 * Utility class for UI element actions in Playwright tests.
 * All methods are original and tailored for K11softwaresolutions.com framework.
 */
export class UIElementActions {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  /**
   * Click an element by its exact text.
   */
  async clickByText(text: string): Promise<void> {
    await this.page.getByText(text, { exact: true }).click();
  }

  /**
   * Click an element using JavaScript selector.
   */
  async clickElementJS(locator: string): Promise<void> {
    await this.page.$eval(locator, (element: HTMLElement) => element.click());
  }
}
