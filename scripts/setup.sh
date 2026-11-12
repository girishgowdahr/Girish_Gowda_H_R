#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# GIRISH Platform — Environment Bootstrap & Setup Script
# Task 1.5
# ==============================================================================

echo "=== [1/4] Checking Required Tooling ==="

check_tool() {
    local tool=$1
    if command -v "$tool" &> /dev/null; then
        echo "  [OK] $tool is available ($(command -v "$tool"))"
    else
        echo "  [MISSING] $tool is not installed or not in PATH."
        return 1
    fi
}

check_tool git || exit 1
check_tool node || exit 1
check_tool npm || exit 1
check_tool java || exit 1
check_tool mvn || exit 1

if command -v docker &> /dev/null; then
    echo "  [OK] docker is available ($(docker --version))"
else
    echo "  [INFO] docker is not installed. Containerized services will be skipped."
fi

echo ""
echo "=== [2/4] Initializing Environment Variables ==="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
    echo "  Creating .env from .env.example with local development defaults..."
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    sed -i.bak 's/SERVER_PORT=/SERVER_PORT=8080/g' "$ROOT_DIR/.env" 2>/dev/null || true
    sed -i.bak 's/SPRING_PROFILES_ACTIVE=/SPRING_PROFILES_ACTIVE=local/g' "$ROOT_DIR/.env" 2>/dev/null || true
    sed -i.bak 's/DB_PORT=/DB_PORT=5432/g' "$ROOT_DIR/.env" 2>/dev/null || true
    sed -i.bak 's/DB_NAME=/DB_NAME=girish/g' "$ROOT_DIR/.env" 2>/dev/null || true
    sed -i.bak 's/DB_USER=/DB_USER=girish/g' "$ROOT_DIR/.env" 2>/dev/null || true
    sed -i.bak 's/DB_PASSWORD=/DB_PASSWORD=girish_dev_password/g' "$ROOT_DIR/.env" 2>/dev/null || true
    rm -f "$ROOT_DIR/.env.bak"
    echo "  [OK] .env generated."
else
    echo "  [OK] .env already exists."
fi

echo ""
echo "=== [3/4] Installing Frontend Dependencies ==="
cd "$ROOT_DIR/frontend"
npm install

echo ""
echo "=== [4/4] Compiling Backend & Verifying Schema ==="
cd "$ROOT_DIR/backend"
mvn test-compile

echo ""
echo "=========================================================================="
echo " GIRISH Platform Setup Complete!"
echo " - To run local Docker stack: docker compose -f docker-compose.local.yml up -d"
echo " - To start frontend dev server: cd frontend && npm run dev"
echo " - To start backend Spring Boot: cd backend && mvn spring-boot:run"
echo " - To run full verification: bash scripts/verify.sh"
echo "=========================================================================="
