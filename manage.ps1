<#
.SYNOPSIS
    Paninos Project Manager Script
.DESCRIPTION
    Simplifies common tasks like running servers, installing dependencies, and building.
    Usage: .\manage.ps1 [command]
#>

param (
    [string]$Command = "help"
)

$BackendPath = Join-Path $PSScriptRoot "backend"
$FrontendPath = Join-Path $PSScriptRoot "frontend"
$VenvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

function Show-Help {
    Write-Host "Paninos Manager Usage:" -ForegroundColor Cyan
    Write-Host "  .\manage.ps1 dev       - Run Backend and Frontend (in new windows)"
    Write-Host "  .\manage.ps1 install   - Install dependencies for both"
    Write-Host "  .\manage.ps1 build     - Build Frontend for production"
    Write-Host "  .\manage.ps1 clean     - Clean temporary files"
}

if ($Command -eq "install") {
    Write-Host "📦 Installing Backend..." -ForegroundColor Yellow
    Push-Location $BackendPath
    & $VenvPython -m pip install -r requirements.txt
    Pop-Location

    Write-Host "📦 Installing Frontend..." -ForegroundColor Yellow
    Push-Location $FrontendPath
    npm install
    Pop-Location
    Write-Host "✅ Done!" -ForegroundColor Green
}
elseif ($Command -eq "dev") {
    Write-Host "🚀 Starting Servers..." -ForegroundColor Green
    
    # Start Backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; & '$VenvPython' manage.py runserver"
    
    # Start Frontend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; npm run dev"
}
elseif ($Command -eq "build") {
    Write-Host "🏗️ Building Frontend..." -ForegroundColor Yellow
    Push-Location $FrontendPath
    npm run build
    Pop-Location
}
elseif ($Command -eq "clean") {
    Write-Host "🧹 Cleaning..." -ForegroundColor Yellow
    if (Test-Path "$FrontendPath\.next") { Remove-Item "$FrontendPath\.next" -Recurse -Force }
    if (Test-Path "$FrontendPath\node_modules") { Remove-Item "$FrontendPath\node_modules" -Recurse -Force }
    Write-Host "✅ Cleaned." -ForegroundColor Green
}
else {
    Show-Help
}
