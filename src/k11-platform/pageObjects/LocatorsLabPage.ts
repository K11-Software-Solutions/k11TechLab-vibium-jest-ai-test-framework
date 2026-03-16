
import { CommonUtils } from "../../utils/CommonUtils";
import { UIElementActions } from "../../utils/UIElementActions";

let commonUtils: CommonUtils;
let uiElementActions: UIElementActions;

export class LocatorsLabPage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
    commonUtils = new CommonUtils(this.page);
    uiElementActions = new UIElementActions(this.page);
  }

  get locatorsLabRoot() { return this.page.find({ id: 'locators-lab-root' }); }
  get mainGrid() { return this.page.find({ id: 'locators-lab-main-grid' }); }
  get controlsPanel() { return this.page.find({ id: 'locators-lab-controls-panel' }); }
  get title() { return this.page.find({ id: 'locators-lab-title' }); }
  get desc() { return this.page.find({ id: 'locators-lab-desc' }); }
  get modeToggle() { return this.page.find({ id: 'locators-lab-mode-toggle' }); }
  get modeCss() { return this.page.find({ id: 'locators-lab-mode-css' }); }
  get modeXpath() { return this.page.find({ id: 'locators-lab-mode-xpath' }); }
  get query() { return this.page.find({ id: 'locators-lab-query' }); }
  get deepToggleRow() { return this.page.find({ id: 'locators-lab-deep-toggle-row' }); }
  get deepToggle() { return this.page.find({ id: 'locators-lab-deep-toggle' }); }
  get actionButtons() { return this.page.find({ id: 'locators-lab-action-buttons' }); }
  get runBtn() { return this.page.find({ id: 'locators-lab-run-btn' }); }
  get clearBtn() { return this.page.find({ id: 'locators-lab-clear-btn' }); }
  get statusRow() { return this.page.find({ id: 'locators-lab-status-row' }); }
  get statusError() { return this.page.find({ id: 'locators-lab-status-error' }); }
  get statusSuccess() { return this.page.find({ id: 'locators-lab-status-success' }); }
  get examples() { return this.page.find({ id: 'locators-lab-examples' }); }
  get sandboxPanel() { return this.page.find({ id: 'locators-lab-sandbox-panel' }); }
  get sandboxTitle() { return this.page.find({ id: 'locators-lab-sandbox-title' }); }
  get sandboxDesc() { return this.page.find({ id: 'locators-lab-sandbox-desc' }); }
  get loader() { return this.page.find({ id: 'locators-lab-loader' }); }
  get sandboxRoot() { return this.page.find({ id: 'locators-lab-sandbox-root' }); }
  get modalCard() { return this.page.find({ selector: "[data-k11='modal-card']" }); }
  get userEmail() { return this.page.find({ id: 'userEmail' }); }
  get userPass() { return this.page.find({ id: 'userPass' }); }
  get companyName() { return this.page.find({ id: 'companyName' }); }
  get mobile() { return this.page.find({ id: 'mobile' }); }
  get country() { return this.page.find({ id: 'country' }); }
  get disabledName() { return this.page.find({ id: 'disabledName' }); }
  get sandboxFormSection() { return this.page.find({ selector: "section:has(h3:has-text('Dummy Form'))" }); }
  get sandboxTableSection() { return this.page.find({ selector: "section:has(h3:has-text('User Table'))" }); }
  get sandboxShadowSection() { return this.page.find({ selector: "section:has(h3:has-text('Shadow DOM'))" }); }
  get sandboxPopupsSection() { return this.page.find({ selector: "section:has(h3:has-text('Popups & Actions'))" }); }
  get sandboxIframeSection() { return this.page.find({ selector: "section:has(h3:has-text('iframe Lab (srcDoc)'))" }); }
  get iframe() { return this.page.find({ selector: "iframe[title='k11-iframe-lab']" }); }

  async fillUserEmail(email: string): Promise<void> {
    const userEmail = await this.userEmail;
    await userEmail.fill(email);
  }

  async fillUserPass(pass: string): Promise<void> {
    const userPass = await this.userPass;
    await userPass.fill(pass);
  }

  async clickRunButton(): Promise<void> {
    const runBtn = await this.runBtn;
    await runBtn.click();
  }

  async clickClearButton(): Promise<void> {
    const clearBtn = await this.clearBtn;
    await clearBtn.click();
  }

  async verifySandboxPanelVisible(): Promise<void> {
    const sandboxPanel = await this.sandboxPanel;
    const visible = await sandboxPanel.isVisible();
    if (!visible) throw new Error('Sandbox panel not visible');
  }
}
