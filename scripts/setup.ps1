# ==============================================================================
# GIRISH Platform — Environment Bootstrap & Setup Script (PowerShell / Windows)
# Task 1.5
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=== [1/4] Checking Required Tooling ===" -ForegroundColor Cyan

function Check-Tool ($commandName) {
    $cmd = Get-Command $commandName -ErrorAction SilentlyContinue
    if ($cmd) {
        Write-Host "  [OK] $commandName is available ($($cmd.Source))" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  [MISSING] $commandName is not installed or not in PATH." -ForegroundColor Red
        return $false
    }
}

$tools = @("git", "node", "npm", "java", "mvn")
$allPresent = $true
foreach ($t in $tools) {
    if (-not (Check-Tool $t)) {
        $allPresent = $false
    }
}

if (-not $allPresent) {
    Write-Host "Please ensure all required tools are installed on PATH before proceeding." -ForegroundColor Red
    exit 1
}

$dockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue
if ($dockerCmd) {
    Write-Host "  [OK] docker is available" -ForegroundColor Green
} else {
    Write-Host "  [INFO] docker is not installed. Containerized services will be skipped." -ForegroundColor Yellow
}

Write-Host "`n=== [2/4] Initializing Environment Variables ===" -ForegroundColor Cyan
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName

if (-not (Test-Path "$rootDir\.env")) {
    Write-Host "  Creating .env from .env.example with local development defaults..."
    Copy-Item "$rootDir\.env.example" "$rootDir\.env"
    (Get-Content "$rootDir\.env") `
        -replace "SERVER_PORT=", "SERVER_PORT=8080" `
        -replace "SPRING_PROFILES_ACTIVE=", "SPRING_PROFILES_ACTIVE=local" `
        -replace "DB_PORT=", "DB_PORT=5432" `
        -replace "DB_NAME=", "DB_NAME=girish" `
        -replace "DB_USER=", "DB_USER=girish" `
        -replace "DB_PASSWORD=", "DB_PASSWORD=girish_dev_password" |
        Set-Content "$rootDir\.env"
    Write-Host "  [OK] .env generated." -ForegroundColor Green
} else {
    Write-Host "  [OK] .env already exists." -ForegroundColor Green
}

Write-Host "`n=== [3/4] Installing Frontend Dependencies ===" -ForegroundColor Cyan
Set-Location "$rootDir\frontend"
npm install

Write-Host "`n=== [4/4] Compiling Backend & Verifying Schema ===" -ForegroundColor Cyan
Set-Location "$rootDir\backend"
mvn test-compile

Write-Host "`n==========================================================================" -ForegroundColor Green
Write-Host " GIRISH Platform Setup Complete!" -ForegroundColor Green
Write-Host " - To run local Docker stack: docker compose -f docker-compose.local.yml up -d"
Write-Host " - To start frontend dev server: cd frontend; npm run dev"
Write-Host " - To start backend Spring Boot: cd backend; mvn spring-boot:run"
Write-Host " - To run full verification: powershell scripts\verify.ps1"
Write-Host "==========================================================================" -ForegroundColor Green
