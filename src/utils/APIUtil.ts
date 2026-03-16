import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility class for API test assertions and file reading.
 * All methods are original and tailored for K11softwaresolutions.com framework.
 */
export class APIUtil {
  /**
   * Assert that the API response status is OK (200).
   * Accepts node-fetch Response or browser Response.
   */
  async assertStatusOk(response: { status: number }): Promise<void> {
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
  }

  /**
   * Assert that all expected keys are present in the response body.
   */
  async assertResponseBodyKeys(expectedKeys: string[], responseBody: Record<string, any>, context: string): Promise<void> {
    for (const key of expectedKeys) {
      if (!(key in responseBody)) {
        throw new Error(`Missing key '${key}' in response body (${context})`);
      }
    }
    // Optionally, check for missing keys in stringified body
    // const bodyString = JSON.stringify(responseBody);
    // const missing = expectedKeys.filter(key => !bodyString.includes(key));
    // if (missing.length > 0) {
    //   throw new Error(`Missing keys in ${context}: ${missing.join(", ")}`);
    // }
  }

  /**
   * Assert that all expected headers are present in the response headers.
   */
  async assertResponseHeaders(expectedHeaders: string, headers: Array<{ name: string, value: string }>, context: string): Promise<void> {
    const expected = expectedHeaders.split(`|`).map(h => h.trim().toLowerCase());

    // Support either headers array (headersArray()) or plain object (response.headers())
    let actualNames: string[] = [];
    let actualValues: string[] = [];
    if (Array.isArray(headers)) {
      actualNames = headers.map(h => (h && h.name ? h.name.trim().toLowerCase() : ``));
      actualValues = headers.map(h => (h && h.value ? String(h.value).toLowerCase() : ``));
    } else if (headers && typeof headers === `object`) {
      actualNames = Object.keys(headers).map(k => k.trim().toLowerCase());
      actualValues = Object.values(headers).map(v => String(v).toLowerCase());
    }

    const missing = expected.filter(exp => {
      if (!exp) return false;
      // exact name match
      if (actualNames.includes(exp)) return false;
      // name contains expected token
      if (actualNames.some(n => n.includes(exp))) return false;
      // any header value contains expected token (tolerant)
      if (actualValues.some(v => v.includes(exp))) return false;
      return true;
    });
    if (missing.length > 0) {
      throw new Error(`Missing headers in ${context}: ${missing.join(", ")}`);
    }
  }

  /**
   * Read values from a text file in the utils/api directory.
   */
  async readTextFile(fileName: string): Promise<string> {
    return fs.readFileSync(`./utils/api/${fileName}.txt`, `utf8`);
  }

  /**
   * Save an API response body to artifacts/apiResponses/<name>.json
   */
  async saveApiResponse(name: string, body: any): Promise<string> {
    const outDir = path.resolve(process.cwd(), `apiResponses`);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(body, null, 2), `utf8`);
    return file;
  }
}
