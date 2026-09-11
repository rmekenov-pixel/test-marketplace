[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$rawInput = ""
if ([Console]::IsInputRedirected) {
    $rawInput = [Console]::In.ReadToEnd()
}

# 1. Проверяем git статус текущего проекта
$projectStatus = git status --porcelain 2>$null

# 2. Проверяем git статус Second Brain
$brainDir = "C:\My PROJECTS\II nd brain\Second-Brain"
$brainStatus = $null
if (Test-Path $brainDir) {
    Push-Location $brainDir
    $brainStatus = git status --porcelain 2>$null
    Pop-Location
}

# Чтобы не создавать бесконечный цикл блокировок при диалоге с пользователем,
# возвращаем decision = "stop". При необходимости жесткого контроля можно переключить на continue.
@{ decision = "stop" } | ConvertTo-Json -Compress | Write-Output
exit 0
