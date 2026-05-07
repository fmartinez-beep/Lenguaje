$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host 'Docker no esta instalado o no esta en el PATH.'
    Write-Host 'Instala Docker Desktop y vuelve a ejecutar: .\start-backend.ps1'
    exit 1
}

docker compose up --build
