@echo off
if "%~1"=="" (
  echo Usage: ai-test-runner\run-ai-test.cmd ^<PageObject^> "^<Goal^>" [type]
  exit /b 1
)
if "%~2"=="" (
  echo Usage: ai-test-runner\run-ai-test.cmd ^<PageObject^> "^<Goal^>" [type]
  exit /b 1
)
set PAGE_OBJECT=%~1
set GOAL=%~2
set TYPE=%~3
if "%TYPE%"=="" set TYPE=functional
npm run ai:generate:test -- --page-object "%PAGE_OBJECT%" --goal "%GOAL%" --type "%TYPE%" --run
