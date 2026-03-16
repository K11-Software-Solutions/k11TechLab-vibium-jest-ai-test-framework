# AI Test Runner

This folder contains one-click runners for the AI test generator.

## Generic runners

### Bash

```bash
./ai-test-runner/run-ai-test.sh HomePage "Verify the homepage can navigate to services"
```

### PowerShell

```powershell
.\ai-test-runner\run-ai-test.ps1 -PageObject HomePage -Goal "Verify the homepage can navigate to services"
```

### CMD

```cmd
ai-test-runner\run-ai-test.cmd HomePage "Verify the homepage can navigate to services"
```

## Preset one-click runners

### Bash presets

- `run-homepage-services.sh`
- `run-login-dashboard.sh`
- `run-formslab-submit.sh`

### PowerShell presets

- `run-homepage-services.ps1`
- `run-login-dashboard.ps1`
- `run-formslab-submit.ps1`

## Root NPM Shortcuts

You can also run the preset flows directly from `package.json`:

```bash
npm run ai:runner:homepage
npm run ai:runner:login
npm run ai:runner:formslab
```

## What they do

Each runner calls:

```bash
npm run ai:generate:test -- --page-object <PageObject> --goal "<Goal>" --type functional --run
```

That means they:
- generate the test
- save it under `src/k11-platform/tests/generated/`
- run the test immediately
- produce reports in `reports/`

## Notes

- The generator auto-loads `.env` from the repo root if present
- Use `.env.example` as the starting point for OpenAI setup
- For more reusable goal ideas, see `prompts/ai-generator-goals.md`
