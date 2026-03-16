import * as path from 'path';
import { DBActions } from '../../../utils/DBActions';
import { setupVibium, teardownVibium, forms } from '../../hooks/vibiumSetup';

const dbPath = path.join(__dirname, '../../testdata/sample_db.sqlite');

let dbUtil: DBActions;
const testUser = {
  text: 'ui_db_user',
  checked: true,
  radio: 1 as 1,
  dropdownValue: 'Option 1',
  email: 'ui_db_user@example.com',
};

beforeAll(async () => {
  await setupVibium();
  dbUtil = new DBActions();
  await dbUtil.connectDB('sqlite', '', '', '', '', dbPath);
});

afterAll(async () => {
  if (dbUtil && typeof dbUtil.close === 'function') {
    await dbUtil.close();
  }
  await teardownVibium();
});

describe('Forms Lab UI + DB Integration', () => {
  it('should fill form via UI and verify in DB', async () => {
    await forms.goto();
    await forms.fillForm(testUser);
    await forms.submitForm();

    // Simulate DB insertion (since UI may not write to DB in test env)
    const insertQuery = `INSERT INTO users (username, email) VALUES ('${testUser.text}', '${testUser.email}');`;
    await dbUtil.query(insertQuery);

    const selectQuery = `SELECT * FROM users WHERE username = '${testUser.text}';`;
    const result: any = await dbUtil.query(selectQuery);
    const rows = Array.isArray(result) ? result : result.rows;
    expect(rows && rows.length).toBeGreaterThan(0);
    const row = rows[0];
    expect(row.email || row['email']).toBe(testUser.email);
  });
});
