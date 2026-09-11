[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$rawInput = ""
if ([Console]::IsInputRedirected) {
    $rawInput = [Console]::In.ReadToEnd()
}
if ([string]::IsNullOrWhiteSpace($rawInput)) {
    @{ decision = "allow" } | ConvertTo-Json -Compress | Write-Output
    exit 0
}

$payload = $rawInput | ConvertFrom-Json
if ($null -eq $payload -or $null -eq $payload.toolCall -or $null -eq $payload.toolCall.args) {
    @{ decision = "allow" } | ConvertTo-Json -Compress | Write-Output
    exit 0
}

$commandArgs = $payload.toolCall.args.CommandLine
if ([string]::IsNullOrWhiteSpace($commandArgs)) {
    @{ decision = "allow" } | ConvertTo-Json -Compress | Write-Output
    exit 0
}

if ($commandArgs -match "(?im)(?:^|[;&|\r\n])\s*git\s+push\b") {
    $today = Get-Date -Format "yyyy-MM-dd"
    $yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
    $journalBase = "C:\My PROJECTS\II nd brain\Second-Brain\journal"
    
    # Определяем реальное имя репозитория проекта
    $repoRoot = git rev-parse --show-toplevel 2>$null
    if ($repoRoot) {
        $currentProjectName = (Split-Path -Leaf $repoRoot).Trim().ToLower()
    } else {
        $loc = (Get-Location).Path
        if ($loc -match "\.agents") {
            $currentProjectName = (Split-Path (Split-Path $loc -Parent) -Leaf).ToLower()
        } else {
            $currentProjectName = (Split-Path $loc -Leaf).ToLower()
        }
    }
    $projHyphen = $currentProjectName -replace '\s+', '-'
    
    $possibleFiles = @(
        (Join-Path (Join-Path $journalBase $today) "$currentProjectName.md"),
        (Join-Path (Join-Path $journalBase $today) "$projHyphen.md"),
        (Join-Path (Join-Path $journalBase $yesterday) "$currentProjectName.md"),
        (Join-Path (Join-Path $journalBase $yesterday) "$projHyphen.md")
    )
    
    $hasValidJournal = $false
    foreach ($f in $possibleFiles) {
        if (Test-Path $f) {
            $content = Get-Content $f -Raw -Encoding UTF8
            if (-not [string]::IsNullOrWhiteSpace($content) -and $content.Length -gt 30) {
                $hasValidJournal = $true
                break
            }
        }
    }
    
    if (-not $hasValidJournal) {
        # Резервная проверка: любая запись в журнале за последние 24 часа
        $recent = Get-ChildItem -Path $journalBase -Recurse -Filter "*.md" -ErrorAction SilentlyContinue |
            Where-Object { $_.LastWriteTime -ge (Get-Date).AddHours(-24) }
        if ($recent) {
            $hasValidJournal = $true
        }
    }
    
    if (-not $hasValidJournal) {
        $response = @{
            decision = "deny"
            reason = "[WORKFLOW BARRIER] Попытка выполнить 'git push' без записи в журнале! Правило системы: ТЕСТЫ ПРОШЛИ -> ЗАПИСЬ В ЖУРНАЛ (journal/$today/$currentProjectName.md) -> GIT PUSH. Создайте запись в журнале Second Brain перед пушем."
        }
        $response | ConvertTo-Json -Compress | Write-Output
        exit 0
    }
}

@{ decision = "allow" } | ConvertTo-Json -Compress | Write-Output
exit 0
