# Quick Start Script for Local Development
# Run this to start both backend and frontend servers

Write-Host "🚀 Starting Geopolitical Intelligence Platform - Local Development" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "my-app-backend") -or -not (Test-Path "my-app-frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Checking setup..." -ForegroundColor Yellow

# Check if backend .env exists
if (-not (Test-Path "my-app-backend\.env")) {
    Write-Host "❌ Backend .env file not found!" -ForegroundColor Red
    Write-Host "   Creating from env.example..." -ForegroundColor Yellow
    Copy-Item "my-app-backend\env.example" "my-app-backend\.env"
    Write-Host "✅ Created .env file - please configure it with your settings" -ForegroundColor Green
}

# Check if node_modules exist
if (-not (Test-Path "my-app-backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location my-app-backend
    npm install
    Pop-Location
}

if (-not (Test-Path "my-app-frontend\node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location my-app-frontend
    npm install
    Pop-Location
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Opening two terminals:" -ForegroundColor Cyan
Write-Host "   Terminal 1: Backend (http://localhost:3001)" -ForegroundColor White
Write-Host "   Terminal 2: Frontend (http://localhost:3000)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Keep both terminals open while developing" -ForegroundColor Yellow
Write-Host ""

# Start backend in new terminal
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\my-app-backend'; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; Write-Host ''; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new terminal
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\my-app-frontend'; Write-Host '⚛️  Frontend Server' -ForegroundColor Cyan; Write-Host ''; npm start"

Write-Host ""
Write-Host "✨ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Wait for both servers to start (check the new terminal windows)" -ForegroundColor White
Write-Host "   2. Browser will open automatically at http://localhost:3000" -ForegroundColor White
Write-Host "   3. Create a test account and start developing!" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more info, see: LOCAL_DEVELOPMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
