import { setupVibium, teardownVibium, forms } from '../../hooks/vibiumSetup';

type FormEntry = { text?: string; checked?: boolean; radio?: 1 | 2; dropdownValue?: string };
const testData: FormEntry[] = [
  { text: 'Test User', checked: true, radio: 1, dropdownValue: 'Option 1' },
  { text: 'Another User', checked: false, radio: 2, dropdownValue: 'Option 2' }
];
jest.setTimeout(120000);

beforeAll(async () => {
  await setupVibium();
}, 30000);

afterAll(async () => {
  await teardownVibium();
}, 30000);

describe('Forms Lab Page - Data Driven', () => {
  beforeEach(async () => {
    await forms.goto();
    await forms.verifyFormVisible();
  }, 30000);

  testData.forEach((data, idx) => {
    it(`fill and submit form - dataset ${idx + 1}`, async () => {
      await forms.fillForm(data);
      await forms.submitForm();
      await forms.verifyFormVisible();
    }, 30000);
  });
});
