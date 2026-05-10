# Rhythm Cluster Site Deploy Script
# Build Next.js static site and copy to NAS (A:)

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Copying to NAS..."
robocopy out "A:\" /E /XD "@Recently-Snapshot" "@Recycle"

$robocopyExit = $LASTEXITCODE
if ($robocopyExit -ge 8) {
    Write-Host "Copy error occurred (Exit Code: $robocopyExit)" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Deploy complete!" -ForegroundColor Green
    Write-Host "http://192.168.1.240:8080/" -ForegroundColor Cyan
}
