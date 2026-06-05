# Script para subir cambios a GitHub automáticamente
Write-Host "Iniciando despliegue de cambios..." -ForegroundColor Cyan

# Comprobar si hay cambios
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "No hay cambios locales para subir." -ForegroundColor Yellow
    Exit
}

Write-Host "Archivos cambiados detectados:" -ForegroundColor Cyan
Write-Host $status

# Agregar todos los cambios
Write-Host "Agregando cambios..." -ForegroundColor Gray
git add -A

# Confirmar cambios
$commitMsg = "Actualizacion automatica: separacion de landing a multi-pagina"
Write-Host "Creando commit: '$commitMsg'..." -ForegroundColor Gray
git commit -m $commitMsg

# Subir cambios
Write-Host "Subiendo cambios a GitHub..." -ForegroundColor Gray
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Despliegue completado con exito!" -ForegroundColor Green
} else {
    Write-Host "Hubo un error al subir los cambios. Por favor, comprueba tus credenciales de Git o conexion." -ForegroundColor Red
}
