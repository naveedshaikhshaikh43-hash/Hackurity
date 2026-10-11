# Byte Forge One-Click Launcher
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Starting Byte Forge Full Stack Environment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start Hardhat Node
Write-Host "[1/3] Starting Hardhat EVM Node on port 8545..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\contracts'; cmd /c 'npx hardhat node'"

Start-Sleep -Seconds 4

# 2. Deploy Contract
Write-Host "[2/3] Deploying GovLogAnchor.sol..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\contracts"
cmd /c "npx hardhat run scripts/deploy.js --network localhost"

# 3. Start Backend
Write-Host "[3/3] Starting FastAPI Backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

# 4. Start Frontend
Write-Host "[4/4] Starting Next.js Frontend on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; cmd /c 'npm run start'"

Write-Host "All services initialized! Open http://localhost:3000" -ForegroundColor Green
