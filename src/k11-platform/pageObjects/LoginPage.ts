import { config } from "../config/appconfig";
import { debugLog, debugWarn } from "../../utils/DebugLogger";
export class LoginPage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  get containerSection() { return this.page.find({ id: 'login-container' }); }
  get titleHeading() { return this.page.find({ id: 'login-title' }); }
  get errorMessage() { return this.page.find({ id: 'login-error' }); }
  get formElement() { return this.page.find({ id: 'login-form' }); }
  get usernameInput() { return this.page.find({ id: 'login-username' }); }
  get passwordInput() { return this.page.find({ id: 'login-password' }); }
  get forgotPasswordLink() { return this.page.find({ id: 'login-forgot-password-link' }); }
  get forgotLink() { return this.page.find({ id: 'login-forgot-link' }); }
  get submitButton() { return this.page.find({ id: 'login-submit' }); }
  get registerLink() { return this.page.find({ id: 'login-register-link' }); }
  get registerHereLink() { return this.page.find({ id: 'login-register-here' }); }

  async goto() {
    await this.page.go(`${config.baseUrl}/login`);
    debugLog('[login] navigated to:', await this.page.url());
    debugLog('[login] page title:', await this.page.title());
    await this.verifyLoginVisible();
  }

  async verifyLoginVisible(timeout: number = config.timeout) {
    await this.page.find({ id: 'login-username' }, { timeout });
    await this.page.find({ id: 'login-password' }, { timeout });
    debugLog('[login] login form inputs are visible');
  }

  async login(username: string, password: string) {
    const passwordInput = await this.passwordInput;
    debugLog(`[login] submitting credentials for: ${username}`);
    await this.setInputValue('login-username', username, 'username');
    await this.setInputValue('login-password', password, 'password');

    await this.page.evaluate(`(() => {
      const form = document.getElementById('login-form');
      if (!form) throw new Error('Missing login form');
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
        return;
      }
      form.submit();
    })()`);

    let currentUrl = await this.page.url();
    if (currentUrl.includes('/login')) {
      await passwordInput.focus();
      await passwordInput.press('Enter');
      currentUrl = await this.page.url();
    }
    debugLog('[login] submit triggered, current url:', currentUrl);
    debugLog('[login] title after submit click:', await this.page.title());
  }

  async setInputValue(id: string, value: string, label: string) {
    let currentValue = '';

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      currentValue = await this.page.evaluate(`(() => {
        const el = document.getElementById(${JSON.stringify(id)});
        if (!el) throw new Error('Missing input: ${id}');
        el.focus();
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (!setter) throw new Error('Missing native value setter');
        setter.call(el, ${JSON.stringify(value)});
        el.dispatchEvent(new InputEvent('input', { bubbles: true, data: ${JSON.stringify(value)} }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        return el.value;
      })()`) as string;

      if (currentValue === value) {
        break;
      }

      const input = await this.page.find({ id }, { timeout: config.timeout });
      await input.click();
      await input.clear();
      await this.page.keyboard.type(value);
      currentValue = await this.page.evaluate(`(() => {
        const el = document.getElementById(${JSON.stringify(id)});
        return el ? el.value : '';
      })()`) as string;

      if (currentValue === value) {
        break;
      }

      await this.page.wait(150);
      debugWarn(`[login] retrying ${label} input set, attempt ${attempt}`);
    }

    debugLog(
      label === 'password'
        ? '[login] password field length after DOM set:'
        : '[login] username field value after DOM set:',
      label === 'password' ? currentValue.length : currentValue
    );
  }

  async loginWithWait(username: string, password: string, timeout: number = 5000) {
    await this.login(username, password);
    try {
      await this.page.find({ text: 'Dashboard' }, { timeout });
      debugLog('[login] dashboard text located');
      return;
    } catch (error) {
      debugWarn('[login] dashboard text not found within timeout');
      try {
        const errorText = await this.getErrorMessage();
        debugWarn('[login] visible error after submit:', errorText);
      } catch {
        debugWarn('[login] no login error element found after submit');
      }
      debugWarn('[login] url after dashboard wait:', await this.page.url());
      debugWarn('[login] title after dashboard wait:', await this.page.title());
      throw error;
    }
  }

  async getErrorMessage(): Promise<string> {
    const errorMessage = await this.page.find({ id: 'login-error' }, { timeout: config.timeout });
    const text = await errorMessage.text();
    debugLog('[login] error text:', text);
    return text;
  }
}
