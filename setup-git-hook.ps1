# setup-git-hook.ps1
# Script para configurar un Git hook (post-commit) que sube automáticamente los cambios al hacer commit.

$ErrorActionPreference = "Stop"

$hooksDir = Join-Path (Get-Location) ".git\hooks"
$hookFile = Join-Path $hooksDir "post-commit"

if (-not (Test-Path $hooksDir)) {
    Write-Host "Error: No se encontró la carpeta .git. Asegúrate de estar en la raíz de un repositorio Git." -ForegroundColor Red
    Exit 1
}

$hookContent = @'
#!/bin/sh
# Hook de post-commit para empujar automáticamente a GitHub
echo ""
echo "=========================================================="
echo " [Git Hook] Detectado commit. Subiendo a GitHub..."
echo "=========================================================="
git push origin main
if [ $? -eq 0 ]; then
    echo " [Git Hook] ¡Subida completada con éxito!"
else
    echo " [Git Hook] Error al subir. Comprueba tu conexión o conflicto."
fi
echo "=========================================================="
echo ""
'@

# Escribir el archivo del hook usando codificación ASCII simple para evitar problemas de compatibilidad en Bash
[System.IO.File]::WriteAllText($hookFile, $hookContent, [System.Text.Encoding]::ASCII)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Instalador de Git Hook (Post-Commit Push)                " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Se ha creado el archivo de hook en: $hookFile" -ForegroundColor Gray
Write-Host "De ahora en adelante, cada vez que hagas un commit (desde la consola" -ForegroundColor Gray
Write-Host "o desde tu editor/VS Code), Git subirá automáticamente a GitHub." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
