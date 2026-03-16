#!/usr/bin/env bash
set -euo pipefail
npm run ai:generate:test -- --page-object HomePage --goal "Verify the homepage can navigate to services" --type functional --run
