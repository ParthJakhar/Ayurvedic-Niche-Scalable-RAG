$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Starting RAG API server and worker..." -ForegroundColor Cyan

# Start chat API server in a new PowerShell window.
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot'; python -m rag_queue.main"
)

# Start queue worker in a second PowerShell window.
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot'; python -m rag_queue.worker_runner"
)

Write-Host "Started both processes in separate terminals." -ForegroundColor Green
Write-Host "API:    http://localhost:8010" -ForegroundColor Yellow
Write-Host "Worker: rag_queue.worker_runner" -ForegroundColor Yellow
