import { browser } from 'vibium';
import { HomePage } from '../pageObjects/HomePage';
import { TablesLabPage } from '../pageObjects/TablesLabPage';
import { FormsLabPage } from '../pageObjects/FormsLabPage';
import { LoginPage } from '../pageObjects/LoginPage';
import { LocatorsLabPage } from '../pageObjects/LocatorsLabPage';
let bro: any;
let page: any;
let home: HomePage;
let tables: TablesLabPage;
let forms: FormsLabPage;
let login: LoginPage;
let locators: LocatorsLabPage;

export async function setupVibium() {
  bro = await browser.start();
  page = await bro.newPage();
  home = new HomePage(page);
  tables = new TablesLabPage(page);
  forms = new FormsLabPage(page);
  login = new LoginPage(page);
  locators = new LocatorsLabPage(page);
}

export async function teardownVibium() {
  await bro?.stop();
}

export { bro, page, home, tables, forms, login, locators };
