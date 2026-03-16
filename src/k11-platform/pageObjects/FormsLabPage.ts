
import { config } from "../config/appconfig";
import { CommonUtils } from "../../utils/CommonUtils";
import { UIElementActions } from "../../utils/UIElementActions";
import { debugLog, debugWarn } from "../../utils/DebugLogger";

let commonUtils: CommonUtils;
let uiElementActions: UIElementActions;

export class FormsLabPage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
    commonUtils = new CommonUtils(this.page);
    uiElementActions = new UIElementActions(this.page);
  }

  get formsLabRoot() { return this.page.find({ id: 'forms-lab-root' }); }
  get title() { return this.page.find({ id: 'forms-lab-title' }); }
  get desc() { return this.page.find({ id: 'forms-lab-desc' }); }
  get form() { return this.page.find({ id: 'forms-lab-form' }); }
  get textFieldRow() { return this.page.find({ id: 'forms-lab-text-field-row' }); }
  get textField() { return this.page.find({ id: 'forms-lab-text-field' }); }
  get checkboxRow() { return this.page.find({ id: 'forms-lab-checkbox-row' }); }
  get checkbox() { return this.page.find({ id: 'forms-lab-checkbox' }); }
  get radioRow() { return this.page.find({ id: 'forms-lab-radio-row' }); }
  get radioGroup() { return this.page.find({ id: 'forms-lab-radio-group' }); }
  get radio1() { return this.page.find({ id: 'forms-lab-radio-1' }); }
  get radio2() { return this.page.find({ id: 'forms-lab-radio-2' }); }
  get dropdownRow() { return this.page.find({ id: 'forms-lab-dropdown-row' }); }
  get dropdown() { return this.page.find({ id: 'forms-lab-dropdown' }); }
  get submitBtn() { return this.page.find({ id: 'forms-lab-submit-btn' }); }

  async fillTextField(value: string): Promise<void> {
    await this.setInputValue('forms-lab-text-field', value, 'text field');
  }

  async checkCheckbox(): Promise<void> {
    const checkbox = await this.page.find({ id: 'forms-lab-checkbox' }, { timeout: config.timeout });
    await checkbox.check();
  }

  async selectRadio(option: 1 | 2): Promise<void> {
    if (option === 1) {
      const radio = await this.radio1;
      await radio.check();
    } else {
      const radio = await this.radio2;
      await radio.check();
    }
  }

  async selectDropdown(value: string): Promise<void> {
    await this.setSelectValue('forms-lab-dropdown', value, 'dropdown');
  }

  async submitForm(): Promise<void> {
    const submitBtn = await this.page.find({ id: 'forms-lab-submit-btn' }, { timeout: config.timeout });
    await submitBtn.click();
  }

  async verifyFormVisible(): Promise<void> {
    await this.page.find({ id: 'forms-lab-form' }, { timeout: config.timeout });
    await this.page.find({ id: 'forms-lab-text-field' }, { timeout: config.timeout });
    await this.page.find({ id: 'forms-lab-submit-btn' }, { timeout: config.timeout });
  }

  async goto(): Promise<void> {
    await this.page.go(`${config.baseUrl}/automation-lab/forms`);
    await this.verifyFormVisible();
  }

  async fillForm({ text, checked, radio, dropdownValue }: { text?: string; checked?: boolean; radio?: 1 | 2; dropdownValue?: string; }): Promise<void> {
    if (text !== undefined) await this.setInputValue('forms-lab-text-field', text, 'text field');
    if (checked !== undefined) {
      const checkbox = await this.page.find({ id: 'forms-lab-checkbox' }, { timeout: config.timeout });
      if (checked) await checkbox.check(); else await checkbox.uncheck();
    }
    if (radio === 1) {
      const radio1 = await this.page.find({ id: 'forms-lab-radio-1' }, { timeout: config.timeout });
      await radio1.check();
    } else if (radio === 2) {
      const radio2 = await this.page.find({ id: 'forms-lab-radio-2' }, { timeout: config.timeout });
      await radio2.check();
    }
    if (dropdownValue !== undefined) {
      await this.setSelectValue('forms-lab-dropdown', dropdownValue, 'dropdown');
    }
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
      currentValue = await input.value();

      if (currentValue === value) {
        break;
      }

      await this.page.wait(150);
      debugWarn(`[forms] retrying ${label} input set, attempt ${attempt}`);
    }

    debugLog(`[forms] ${label} value after set:`, currentValue);
  }

  async setSelectValue(id: string, value: string, label: string) {
    let currentValue = '';

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      currentValue = await this.page.evaluate(`(() => {
        const el = document.getElementById(${JSON.stringify(id)});
        if (!el) throw new Error('Missing select: ${id}');
        el.value = ${JSON.stringify(value)};
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return el.value;
      })()`) as string;

      if (currentValue === value) {
        break;
      }

      const dropdown = await this.page.find({ id }, { timeout: config.timeout });
      await dropdown.selectOption(value);
      currentValue = await dropdown.value();

      if (currentValue === value) {
        break;
      }

      await this.page.wait(150);
      debugWarn(`[forms] retrying ${label} select set, attempt ${attempt}`);
    }

    debugLog(`[forms] ${label} value after set:`, currentValue);
  }
}




