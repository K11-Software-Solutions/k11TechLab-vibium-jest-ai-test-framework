# AI Generator Goal Prompts

These goal prompts are designed for `scripts/ai/generate-test.mjs`.

Use them like this:

```bash
npm run ai:generate:test -- --page-object HomePage --goal "Verify the hero section is visible"
```

## HomePage Goals

- Verify the hero section is visible
- Verify the homepage loads and the hero title is visible
- Verify the homepage can navigate to services
- Verify the homepage can navigate to contact
- Verify the homepage can navigate to the tech lab page
- Verify the homepage can navigate to insights
- Verify the homepage can navigate to dashboard
- Verify the homepage hero and contact flow
- Verify the homepage hero and services flow

## LoginPage Goals

- Verify valid login reaches dashboard
- Verify invalid login stays on the login page
- Verify login form is visible
- Verify login page loads successfully
- Verify login with valid credentials and dashboard access
- Verify login failure with invalid credentials

## FormsLabPage Goals

- Verify the forms lab page loads successfully
- Verify the form is visible
- Verify text input can be filled
- Verify dropdown selection works
- Verify radio selection works
- Verify checkbox selection works
- Verify the form can be filled and submitted
- Verify form submission after entering sample data

## LocatorsLabPage Goals

- Verify the locators lab page loads successfully
- Verify the important locator elements are visible
- Verify locator-based element interaction works
- Verify sample elements can be found using locators

## TablesLabPage Goals

- Verify the tables lab page loads successfully
- Verify table content is visible
- Verify table rows are present
- Verify table interaction works

## Mixed Showcase Goals

- Verify the homepage loads and navigate to services
- Verify valid login reaches dashboard and capture a screenshot
- Verify the forms lab page loads and submit sample data
- Verify the homepage contact flow works
- Verify the homepage services flow works

## Conservative Goals For Fallback Mode

These work especially well when OpenAI is not configured and the local template fallback is used:

- Verify the hero title is visible
- Verify valid login reaches dashboard
- Verify invalid login stays on the login page
- Verify the form is visible
- Verify the form can be filled and submitted
- Verify the homepage can navigate to services
- Verify the homepage can navigate to contact

## Example Commands

```bash
npm run ai:generate:test -- --page-object HomePage --goal "Verify the homepage can navigate to services"
npm run ai:generate:test -- --page-object LoginPage --goal "Verify valid login reaches dashboard"
npm run ai:generate:test -- --page-object FormsLabPage --goal "Verify the form can be filled and submitted"
npm run ai:generate:test -- --page-object HomePage --goal "Verify the homepage can navigate to contact" --run
```
