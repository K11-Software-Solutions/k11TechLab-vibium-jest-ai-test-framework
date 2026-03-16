import * as fs from 'fs';

export class DataProvider {
  static fetchDataFromCsv(filePath: string): Array<Record<string, string>> {
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, `utf8`);
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) return [];
    const headers = lines[0].split(`,`).map(h => h.trim());
    const rows: Array<Record<string, string>> = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(`,`);
      const obj: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = (cols[j] || ``).trim();
      }
      rows.push(obj);
    }
    return rows;
  }
}

export default DataProvider;
