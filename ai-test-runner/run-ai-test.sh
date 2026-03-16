#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: ./ai-test-runner/run-ai-test.sh <PageObject> \"<Goal>\" [type]"
  exit 1
fi

PAGE_OBJECT="$1"
GOAL="$2"
TEST_TYPE="${3:-functional}"

npm run ai:generate:test -- --page-object "$PAGE_OBJECT" --goal "$GOAL" --type "$TEST_TYPE" --run
