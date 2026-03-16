#!/usr/bin/env bash
set -euo pipefail
npm run ai:generate:test -- --page-object LoginPage --goal "Verify valid login reaches dashboard" --type functional --run
