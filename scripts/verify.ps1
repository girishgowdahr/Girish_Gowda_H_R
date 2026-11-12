# ==============================================================================
# GIRISH Platform — Full System Verification Script (PowerShell / Windows)
# Task 1.5
# ==============================================================================

$ErrorActionPreference = "Stop"
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host " Starting Full Verification: GIRISH Platform" -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

Write-Host "`n--- [1/2] Verifying Frontend (TypeScript, Vitest, axe A11y, Build) ---" -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
npx tsc --noEmit
npm test -- --run
npm run build
Write-Host "  [PASS] Frontend verification succeeded." -ForegroundColor Green

Write-Host "`n--- [2/2] Verifying Backend (Spring Boot, ArchUnit, Flyway, JPA) ---" -ForegroundColor Yellow
Set-Location "$rootDir\backend"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot"
$env:PATH = "C:\apache-maven-3.9.8\bin;$env:JAVA_HOME\bin;$env:PATH"
mvn test
Write-Host "  [PASS] Backend verification succeeded." -ForegroundColor Green

Write-Host "`n==========================================================================" -ForegroundColor Green
Write-Host " ALL VERIFICATIONS PASSED (Frontend + Backend + DB Migrations + A11y)" -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Green
