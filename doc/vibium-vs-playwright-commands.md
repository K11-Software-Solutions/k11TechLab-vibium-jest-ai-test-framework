# Vibium vs Playwright: Command Differences

This document summarizes the main command differences between Vibium and Playwright for browser automation.

---

## 1. Element Selection

- **Playwright:**
  - `page.locator('#element-id')`
  - `page.getByText('text')`

- **Vibium:**
  - `page.find({ id: 'element-id' })`
  - `page.find({ role: 'link' })`

## 2. Navigation

- **Playwright:**
  - `await page.goto('https://example.com')`

- **Vibium:**
  - `await page.go('https://example.com')`

## 3. Filling Inputs

- **Playwright:**
  - `await page.locator('#input').fill('value')`

- **Vibium:**
  - `await page.find({ id: 'input' }).fill('value')`

## 4. Clicking Elements

- **Playwright:**
  - `await page.locator('#button').click()`

- **Vibium:**
  - `await page.find({ id: 'button' }).click()`

## 5. Checking Visibility

- **Playwright:**
  - `await expect(page.locator('#form')).toBeVisible()`

- **Vibium:**
  - `const visible = await page.find({ id: 'form' }).isVisible()`
  - `if (!visible) throw new Error('Not visible')`

## 6. Waiting for State

- **Playwright:**
  - `await page.locator('#element').waitFor({ state: 'visible' })`

- **Vibium:**
  - `await page.find({ id: 'element' }).waitFor({ state: 'visible' })`

## 7. Selecting Dropdown Options

- **Playwright:**
  - `await page.locator('#dropdown').selectOption('value')`

- **Vibium:**
  - `await page.find({ id: 'dropdown' }).selectOption('value')`

## 8. Screenshots

- **Playwright:**
  - `await page.screenshot({ path: 'file.png' })`

- **Vibium:**
  - `await page.screenshot()`

---

**Summary:**
Vibium uses `page.find({ ... })` for element selection and `page.go()` for navigation, while Playwright uses `page.locator()` and `page.goto()`. Most element actions (fill, click, check, selectOption) are similar but use Vibium’s element handles. Assertions and waits are handled differently, with Vibium relying on direct method calls and manual error handling.
