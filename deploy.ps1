# Script para subir cambios a GitHub automáticamente
param(
    [string]$CommitMessage = "",
    [switch]$Batch
)

$ErrorActionPreference = "Stop"

Write-Host "Iniciando despliegue de cambios..." -ForegroundColor Cyan

# Comprobar si hay cambios
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No hay cambios locales para subir. Todo está al día." -ForegroundColor Green
    if (-not $Batch) {
        Read-Host "`nPresiona Enter para salir..."
    }
    Exit
}

Write-Host "Archivos cambiados detectados:" -ForegroundColor Cyan
Write-Host $status

# Agregar todos los cambios
Write-Host "Agregando cambios..." -ForegroundColor Gray
git add -A

# Determinar mensaje de commit
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    # Generar un mensaje dinámico basado en los archivos modificados
    $modifiedFiles = $status -split "`r?`n" | ForEach-Object {
        if ($_ -match '^\s*[MADRCU? ]+\s+(.+)$') {
            $file = $Matches[1].Trim()
            Split-Path -Leaf $file
        }
    } | Where-Object { $_ }
    
    $fileSummary = ($modifiedFiles -join ", ")
    if ($fileSummary.Length -gt 60) {
        $fileSummary = $fileSummary.Substring(0, 57) + "..."
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $CommitMessage = "Auto: actualiza $fileSummary [$timestamp]"
}

Write-Host "Creando commit: '$CommitMessage'..." -ForegroundColor Gray
git commit -m $CommitMessage

# Asegurarse de tener los cambios más recientes antes de subir
Write-Host "Haciendo pull con rebase para evitar conflictos..." -ForegroundColor Gray
try {
    git pull --rebase origin main
} catch {
    Write-Host "Error al hacer pull. Es posible que haya conflictos de merge que debas resolver manualmente." -ForegroundColor Red
    if (-not $Batch) {
        Read-Host "`nPresiona Enter para salir..."
    }
    Exit 1
}

# Subir cambios
Write-Host "Subiendo cambios a GitHub (origin/main)..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n¡Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "Los cambios se verán en Vercel, Cloudflare y GitHub Pages en unos momentos." -ForegroundColor Gray
} else {
    Write-Host "`nHubo un error al subir los cambios. Por favor, comprueba tus credenciales de Git o conexión." -ForegroundColor Red
}

if (-not $Batch) {
    Read-Host "`nPresiona Enter para cerrar..."
}
