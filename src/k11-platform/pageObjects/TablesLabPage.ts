import { CommonUtils } from '../../utils/CommonUtils';
import { UIElementActions } from '../../utils/UIElementActions';

let commonUtils: CommonUtils;
let uiElementActions: UIElementActions;

export class TablesLabPage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
    commonUtils = new CommonUtils(this.page);
    uiElementActions = new UIElementActions(this.page);
  }

  get tablesLabRoot() { return this.page.find({ id: 'tables-lab-root' }); }
  get title() { return this.page.find({ id: 'tables-lab-title' }); }
  get desc() { return this.page.find({ id: 'tables-lab-desc' }); }
  get table() { return this.page.find({ id: 'tables-lab-table' }); }
  get thead() { return this.page.find({ id: 'tables-lab-thead' }); }
  get headerRow() { return this.page.find({ id: 'tables-lab-header-row' }); }
  get headerName() { return this.page.find({ id: 'tables-lab-header-name' }); }
  get headerAge() { return this.page.find({ id: 'tables-lab-header-age' }); }
  get headerRole() { return this.page.find({ id: 'tables-lab-header-role' }); }
  get tbody() { return this.page.find({ id: 'tables-lab-tbody' }); }
  get row1() { return this.page.find({ id: 'tables-lab-row-1' }); }
  get row1Name() { return this.page.find({ id: 'tables-lab-row-1-name' }); }
  get row1Age() { return this.page.find({ id: 'tables-lab-row-1-age' }); }
  get row1Role() { return this.page.find({ id: 'tables-lab-row-1-role' }); }
  get row2() { return this.page.find({ id: 'tables-lab-row-2' }); }
  get row2Name() { return this.page.find({ id: 'tables-lab-row-2-name' }); }
  get row2Age() { return this.page.find({ id: 'tables-lab-row-2-age' }); }
  get row2Role() { return this.page.find({ id: 'tables-lab-row-2-role' }); }
  get row3() { return this.page.find({ id: 'tables-lab-row-3' }); }
  get row3Name() { return this.page.find({ id: 'tables-lab-row-3-name' }); }
  get row3Age() { return this.page.find({ id: 'tables-lab-row-3-age' }); }
  get row3Role() { return this.page.find({ id: 'tables-lab-row-3-role' }); }
  get featuresList() { return this.page.find({ id: 'tables-lab-features-list' }); }
  get featureSort() { return this.page.find({ id: 'tables-lab-feature-sort' }); }
  get featureFilter() { return this.page.find({ id: 'tables-lab-feature-filter' }); }
  get featureEdit() { return this.page.find({ id: 'tables-lab-feature-edit' }); }
}
