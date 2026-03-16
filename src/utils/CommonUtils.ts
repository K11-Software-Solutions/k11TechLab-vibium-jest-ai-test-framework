import * as fs from 'fs';
import * as CryptoJS from 'crypto-js';
import { browser } from 'vibium';
import { Workbook } from 'exceljs';
// import { testConfig } from '../testConfig';
import * as pdfjslib from 'pdfjs-dist-es5';

/**
 * Common utility class for non-UI actions in Playwright tests.
 * All methods are original and tailored for K11softwaresolutions.com framework.
 */
export class CommonUtils {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  /**
   * Decipher an encrypted password using AES.
   * NOTE: testConfig is missing, so this method is stubbed.
   */
  async decryptPassword(): Promise<string> {
    // const key = `SECRET`;
    // return CryptoJS.AES.decrypt(testConfig.password, key).toString(CryptoJS.enc.Utf8);
    throw new Error("testConfig module not found. Please provide password source.");
  }

  async waitMilliseconds(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getExcelCellValue(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
    const workbook = new Workbook();
    return workbook.xlsx.readFile(`./Downloads/${fileName}`).then(() => {
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) throw new Error(`Sheet '${sheetName}' not found in ${fileName}`);
      return sheet.getRow(rowNum).getCell(cellNum).toString();
    });
  }

  async readTextFile(filePath: string): Promise<string> {
    return fs.readFileSync(`${filePath}`, `utf-8`);
  }

  async writeTextFile(filePath: number | fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<void> {
    fs.writeFile(filePath, data, error => {
      if (error) throw error;
    });
  }

  async extractPdfPageText(pdf: any, pageNo: number): Promise<string> {
    const page = await pdf.getPage(pageNo);
    const tokenizedText = await page.getTextContent();
    return tokenizedText.items.map((token: any) => token.str).join(``);
  }

  async extractPdfText(filePath: any): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdf = await pdfjslib.getDocument(dataBuffer).promise;
    const maxPages = pdf.numPages;
    const pageTextPromises = [];
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      pageTextPromises.push(this.extractPdfPageText(pdf, pageNo));
    }
    const pageTexts = await Promise.all(pageTextPromises);
    return pageTexts.join(` `);
  }
}
