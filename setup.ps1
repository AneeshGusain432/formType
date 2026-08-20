# setup.ps1
# Windows/PowerShell equivalent of setup.sh
# Uses HARD LINKS instead of symlinks - these work on NTFS without
# needing Administrator rights or Developer Mode. A hard link points
# to the same data on disk, so editing the file from any linked
# location updates it everywhere.

# 1. Ensure root .env exists
if (Test-Path ".env") {
    Write-Host ".env file exists. [OK]"
} else {
    Write-Host ".env file does not exist. Creating from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        Write-Host "WARNING: .env.example not found - cannot create .env."
        exit 1
    }
}

$rootEnv = (Resolve-Path ".env").Path

# 2. Gather target directories (apps/* and packages/*)
$dirs = @()
$dirs += Get-ChildItem -Path "apps" -Directory -ErrorAction SilentlyContinue
$dirs += Get-ChildItem -Path "packages" -Directory -ErrorAction SilentlyContinue

foreach ($dir in $dirs) {
    $target = Join-Path $dir.FullName ".env"

    if (Test-Path $target) {
        # Check if it's already a hard link to the same file
        $rootFileId = (Get-Item $rootEnv).LinkTarget
        Write-Host "Skipping $target (already exists)"
        continue
    }

    try {
        New-Item -ItemType HardLink -Path $target -Target $rootEnv -ErrorAction Stop | Out-Null
        Write-Host "Linked $target -> $rootEnv"
    } catch {
        Write-Host "ERROR: Failed to hard link $target"
        Write-Host $_.Exception.Message
    }
}