import { config } from "../config/appconfig";
import { CommonUtils } from "../../utils/CommonUtils";
import { UIElementActions } from "../../utils/UIElementActions";
import { debugWarn } from "../../utils/DebugLogger";

let commonUtils: CommonUtils;
let uiElementActions: UIElementActions;

export class HomePage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
    commonUtils = new CommonUtils(this.page);
    uiElementActions = new UIElementActions(this.page);
  }

  get homeHeroTitle() { return this.page.find('h1'); }
  get homeHeroDescription() { return this.page.find('main p'); }
  get homeExploreServicesBtn() { return this.page.find('a[href="/services"]'); }
  get homeContactBtn() { return this.page.find('a[href="/contact"]'); }
  get homeBenefitFast() { return this.page.find({ text: 'Fast delivery' }); }
  get homeBenefitScalable() { return this.page.find({ text: 'Scalable architecture' }); }
  get homeBenefitAi() { return this.page.find({ text: 'AI-ready solutions' }); }
  get homeTechLabLink() { return this.page.find('a[href="/tech-lab"]'); }
  get homeInsightsLink() { return this.page.find('a[href="/insights"]'); }
  get homeServicesLink() { return this.page.find('a[href="/services"]'); }
  get homeDashboardLink() { return this.page.find('a[href="/dashboard"]'); }

  async goto() {
    let lastError: unknown;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        await this.page.go(config.baseUrl);
        const heroTitle = await this.page.find('h1', { timeout: config.timeout });
        const visible = await heroTitle.isVisible();
        if (!visible) throw new Error('Hero title not visible');
        return;
      } catch (error) {
        lastError = error;
        debugWarn(`[HomePage.goto] attempt ${attempt} failed`);
      }
    }
    throw lastError;
  }

  async clickExploreServices(): Promise<void> {
    const button = await this.homeExploreServicesBtn;
    await button.click();
  }

  async clickContact(): Promise<void> {
    const button = await this.homeContactBtn;
    await button.click();
  }

  async verifyHeroTitleVisible(): Promise<void> {
    const heroTitle = await this.homeHeroTitle;
    const visible = await heroTitle.isVisible();
    if (!visible) throw new Error('Hero title not visible');
  }

  async goToTechLab(): Promise<void> {
    const link = await this.homeTechLabLink;
    await link.click();
  }

  async goToInsights(): Promise<void> {
    const link = await this.homeInsightsLink;
    await link.click();
  }

  async goToServices(): Promise<void> {
    const link = await this.homeServicesLink;
    await link.click();
  }

  async goToDashboard(): Promise<void> {
    const link = await this.homeDashboardLink;
    await link.click();
  }
}
