#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# GIRISH Platform — Full System Verification Script
# Task 1.5
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=========================================================================="
echo " Starting Full Verification: GIRISH Platform"
echo "=========================================================================="

echo ""
echo "--- [1/2] Verifying Frontend (TypeScript, Vitest, axe A11y, Build) ---"
cd "$ROOT_DIR/frontend"
npx tsc --noEmit
npm test -- --run
npm run build
echo "  [PASS] Frontend verification succeeded."

echo ""
echo "--- [2/2] Verifying Backend (Spring Boot, ArchUnit, Flyway, JPA) ---"
cd "$ROOT_DIR/backend"
mvn test
echo "  [PASS] Backend verification succeeded."

echo ""
echo "=========================================================================="
echo " ALL VERIFICATIONS PASSED (Frontend + Backend + DB Migrations + A11y)"
echo "=========================================================================="
