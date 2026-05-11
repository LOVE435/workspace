# 洗漱西街 — 自主代理启动器
# 用法: powershell -File agent-runner.ps1 -TaskName "daily-check" -Prompt "检查GitHub"
# 或:   schtasks 调用此脚本

param(
    [string]$TaskName = "autonomous-task",
    [string]$Prompt = ""
)

$LogDir = "$env:USERPROFILE\workspace\logs"
$LogFile = "$LogDir\$TaskName-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').log"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$Timestamp] 洗漱西街启动 — 任务: $TaskName" | Tee-Object -FilePath $LogFile
"提示: $Prompt" | Tee-Object -FilePath $LogFile -Append

try {
    $env:CLAUDE_PROJECT_DIR = "$env:USERPROFILE\workspace"
    Set-Location $env:USERPROFILE\workspace

    $Result = claude -p $Prompt 2>&1
    $ExitCode = $LASTEXITCODE

    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 完成 (exit=$ExitCode)" | Tee-Object -FilePath $LogFile -Append
    $Result | Tee-Object -FilePath $LogFile -Append
} catch {
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 错误: $_" | Tee-Object -FilePath $LogFile -Append
}
