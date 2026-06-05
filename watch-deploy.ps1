# watch-deploy.ps1
# Script para vigilar cambios en los archivos locales y subirlos automáticamente en tiempo real.

$ScriptDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($ScriptDir)) { $ScriptDir = Get-Location }

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Get-Location
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Filtros para evitar reaccionar a cambios innecesarios
$ignoredPatterns = @(
    '\\.git',
    '\\.venv',
    '\\.vscode',
    '\\.gemini',
    '\\.vercel',
    '\\.cloudflare',
    '\\.log$',
    'deploy\\.ps1',
    'watch-deploy\\.ps1',
    'setup-git-hook\\.ps1',
    '~'
)

# Cola de archivos cambiados
$global:changedFiles = [System.Collections.Generic.HashSet[string]]::new()
$global:timer = New-Object System.Timers.Timer
$global:timer.Interval = 5000 # 5 segundos de espera/debounce
$global:timer.AutoReset = $false

# Acción a ejecutar cuando expira el temporizador
$action = {
    $files = $global:changedFiles | ForEach-Object { $_ }
    $global:changedFiles.Clear()
    
    if ($files.Count -gt 0) {
        $ScriptDir = $Event.MessageData
        Write-Host "`n[Auto-Watch] Cambios detectados en: ($($files -join ', ')). Iniciando despliegue..." -ForegroundColor Yellow
        
        # Ejecutar el deploy en un proceso separado para evitar bloqueos en el hilo del evento
        $deployScript = Join-Path $ScriptDir "deploy.ps1"
        try {
            $proc = Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File ""$deployScript"" -Batch" -NoNewWindow -PassThru -Wait
            if ($proc.ExitCode -ne 0) {
                Write-Host "[Auto-Watch] El despliegue finalizo con codigo de error: $($proc.ExitCode)" -ForegroundColor Red
            }
        } catch {
            Write-Host "[Auto-Watch] Error al intentar iniciar el proceso de despliegue: $_" -ForegroundColor Red
        }
    }
}

Register-ObjectEvent -InputObject $global:timer -EventName Elapsed -Action $action -MessageData $ScriptDir | Out-Null

# Manejador de eventos de cambio de archivo
$onChanged = {
    param($sender, $eventArgs)
    $path = $eventArgs.FullPath
    
    # Obtener ruta relativa
    $relPath = $path
    if ($path.StartsWith((Get-Location).Path)) {
        $relPath = $path.Substring((Get-Location).Path.Length).TrimStart('\')
    }
    
    # Comprobar si el archivo coincide con algún patrón a ignorar
    $shouldIgnore = $false
    foreach ($pattern in $ignoredPatterns) {
        if ($path -match $pattern) {
            $shouldIgnore = $true
            break
        }
    }
    
    # También ignorar si es un directorio
    if (Test-Path $path -PathType Container) {
        $shouldIgnore = $true
    }
    
    if (-not $shouldIgnore) {
        # Agregar a la cola y reiniciar temporizador
        $global:changedFiles.Add($relPath) | Out-Null
        $global:timer.Stop()
        $global:timer.Start()
        Write-Host "[Auto-Watch] Modificado: $relPath (guardando cambios, esperando pausa de 5s...)" -ForegroundColor Gray
    }
}

# Registrar eventos
$events = @("Changed", "Created", "Deleted", "Renamed")
$jobs = @()
foreach ($event in $events) {
    $jobs += Register-ObjectEvent -InputObject $watcher -EventName $event -Action $onChanged
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Vigilante de Archivos Iniciado (Watch-Deploy)            " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Vigilando cambios en: $(Get-Location)" -ForegroundColor Gray
Write-Host "Cualquier guardado iniciará un commit y push automático" -ForegroundColor Gray
Write-Host "tras 5 segundos de inactividad." -ForegroundColor Gray
Write-Host "Presiona Ctrl+C en esta terminal para detener el vigilante." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Mantener el script vivo
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Limpieza al salir
    Write-Host "`nDeteniendo vigilante y liberando recursos..." -ForegroundColor Cyan
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    $global:timer.Stop()
    $global:timer.Dispose()
    foreach ($job in $jobs) {
        Unregister-Event -SourceIdentifier $job.Name -ErrorAction SilentlyContinue
    }
}
