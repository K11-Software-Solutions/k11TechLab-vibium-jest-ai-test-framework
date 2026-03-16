# AI Test Generator

This project includes a repo-aware AI-assisted generator for Jest + Vibium tests.

## Script

`scripts/ai/generate-test.mjs`

## What It Does

- Reads a real page object from `src/k11-platform/pageObjects`
- Detects the shared alias from `src/k11-platform/hooks/vibiumSetup.ts`
- Generates a Jest-compatible TypeScript test file
- Uses OpenAI when `OPENAI_API_KEY` is available
- Falls back to a local template generator when the API key is missing or the request fails

## Usage

```bash
node scripts/ai/generate-test.mjs --page-object HomePage --goal "Verify the hero and navigate to services"
```

Optional arguments:

- `--type functional`
- `--output src/k11-platform/tests/generated/homepage.ai.test.ts`
- `--run`
- `--page-object LoginPage`
- `--goal "Verify valid login reaches dashboard"`

Generate and run in one step:

```bash
node scripts/ai/generate-test.mjs --page-object HomePage --goal "Verify the hero and navigate to services" --run
```

## OpenAI Configuration

Environment variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` optional, default is `gpt-4.1-mini`
- `OPENAI_BASE_URL` optional, default is `https://api.openai.com/v1/responses`

The generator auto-loads `.env` from the repo root if it exists. Use `.env.example`
as the starting template.

The generator uses the OpenAI Responses API and Structured Outputs so the model
returns a predictable JSON payload.

Useful references:

- https://platform.openai.com/docs/guides/migrate-to-responses
- https://platform.openai.com/docs/api-reference/responses/compact?api-mode=responses

## Fallback Mode

If OpenAI is not configured, the script still produces a useful starter test by:

- calling `goto()` when available
- using a `verify...` method when available
- picking an action method based on the goal text
- adding a simple URL or visibility assertion

## Output

By default, generated tests go to:

`src/k11-platform/tests/generated/`

Example output pattern:

`home-page.functional.verify-the-hero-and-navigate-to-services.ai.test.ts`

## Recommended Workflow

1. Generate the test
2. Review the test like normal code
3. Run the generated test, or use `--run` to do that immediately
4. Refine selectors or assertions if the scenario is more specific than the page object currently supports
