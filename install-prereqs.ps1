<#
RetailSense AI prerequisite installer helper.
Run this from PowerShell to verify tools and optionally open downloads.
#>

function Test-Program {
    param(
        [string]$Command,
        [string]$VersionArg = "--version"
    )
    try {
        $process = Start-Process -FilePath $Command -ArgumentList $VersionArg -NoNewWindow -PassThru -RedirectStandardOutput temp.txt -RedirectStandardError temp.txt -WindowStyle Hidden
        $process.WaitForExit()
        return $process.ExitCode -eq 0
    } catch {
        return $false
    }
}

function Open-Url {
    param([string]$Url)
    Write-Host "Opening $Url" -ForegroundColor Cyan
    Start-Process $Url
}

Write-Host "RetailSense AI prerequisite checker" -ForegroundColor Yellow

$requirements = @(
    @{ Name = 'Node.js + npm'; Check = { Test-Program 'node' '--version' } ; Url = 'https://nodejs.org/en/download/' },
    @{ Name = 'Python 3.14'; Check = { Test-Program 'py' '-3.14 --version' } ; Url = 'https://www.python.org/downloads/release/python-3140/' },
    @{ Name = 'Docker Desktop (optional)'; Check = { Test-Program 'docker' '--version' } ; Url = 'https://www.docker.com/products/docker-desktop/' }
)

$missing = @()
foreach ($item in $requirements) {
    Write-Host "Checking $($item.Name)..." -NoNewline
    if (& $item.Check) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " MISSING" -ForegroundColor Red
        $missing += $item
    }
}

if ($missing.Count -eq 0) {
    Write-Host "All required prerequisites are installed." -ForegroundColor Green
    Write-Host "If you still need to run the application, use the README commands." -ForegroundColor Cyan
    exit 0
}

Write-Host "`nThe following prerequisites are missing:" -ForegroundColor Yellow
$missing | ForEach-Object { Write-Host "- $($_.Name)" }

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "`nwinget is available. You can install some tools automatically." -ForegroundColor Cyan
    foreach ($item in $missing) {
        switch ($item.Name) {
            'Node.js + npm' {
                Write-Host "Installing Node.js LTS..." -ForegroundColor Cyan
                winget install OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
            }
            'Python 3.14' {
                Write-Host "Installing Python 3.14..." -ForegroundColor Cyan
                winget install Python.Python.3.14 -e --accept-source-agreements --accept-package-agreements
            }
            'Docker Desktop (optional)' {
                Write-Host "Installing Docker Desktop..." -ForegroundColor Cyan
                winget install Docker.DockerDesktop -e --accept-source-agreements --accept-package-agreements
            }
        }
    }
    Write-Host "`nIf any installation fails, open the download links manually below:" -ForegroundColor Cyan
}

foreach ($item in $missing) {
    Write-Host "$($item.Name): $($item.Url)" -ForegroundColor Blue
}

Write-Host "`nTo open download pages now, type Y and press Enter." -ForegroundColor Yellow
$answer = Read-Host "Open downloads? [Y/N]"
if ($answer -match '^[Yy]$') {
    foreach ($item in $missing) {
        Open-Url $item.Url
    }
}

Write-Host "`nAfter installing prerequisites, run the setup steps in README.md." -ForegroundColor Green
