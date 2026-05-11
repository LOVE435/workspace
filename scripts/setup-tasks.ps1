# XishuXijie Agent Task Registration
# Run directly in PowerShell

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Workspace = Resolve-Path "$ScriptDir\.."
$Runner = "$ScriptDir\agent-runner.ps1"
$LogDir = "$Workspace\logs"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

Write-Host "=== XishuXijie Agent Setup ===" -ForegroundColor Cyan

# Task 1: Morning check (daily 09:03)
try {
    $a1 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -File `"$Runner`" -TaskName 'morning-check' -Prompt 'You are XishuXijie. Check LOVE435 GitHub repos for new activity, issues, PRs. Read task-queue.md, update progress. List today todos. Under 200 words.'"
    $t1 = New-ScheduledTaskTrigger -Daily -At "09:03"
    Register-ScheduledTask -TaskName "XishuXijie-MorningCheck" -Description "Daily 9am GitHub check and task review" -Action $a1 -Trigger $t1 -Force | Out-Null
    Write-Host "[OK] XishuXijie-MorningCheck — daily 09:03" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] MorningCheck: $_" -ForegroundColor Red
}

# Task 2: Daytime poll (every 2h, starting 10:03)
try {
    $a2 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -File `"$Runner`" -TaskName 'daytime-poll' -Prompt 'You are XishuXijie. Quick poll: check GitHub notifications, update task-queue.md. If nothing new, reply idle. Under 100 words.'"
    $t2 = New-ScheduledTaskTrigger -Daily -At "10:03"
    $t2.Repetition = (New-ScheduledTaskRepetition -Interval (New-TimeSpan -Hours 2) -Duration (New-TimeSpan -Hours 8))
    Register-ScheduledTask -TaskName "XishuXijie-DaytimePoll" -Description "Every 2h from 10:00-18:00" -Action $a2 -Trigger $t2 -Force | Out-Null
    Write-Host "[OK] XishuXijie-DaytimePoll — every 2h (10:00-18:00)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] DaytimePoll: $_" -ForegroundColor Red
}

# Task 3: Daily archive (daily 18:03)
try {
    $a3 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -File `"$Runner`" -TaskName 'daily-archive' -Prompt 'You are XishuXijie. Archive today: summarize completed tasks from task-queue.md, mark incomplete items, write daily summary to memory/daily-log.md. Under 200 words.'"
    $t3 = New-ScheduledTaskTrigger -Daily -At "18:03"
    Register-ScheduledTask -TaskName "XishuXijie-DailyArchive" -Description "Daily 6pm summary and archive" -Action $a3 -Trigger $t3 -Force | Out-Null
    Write-Host "[OK] XishuXijie-DailyArchive — daily 18:03" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] DailyArchive: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host "View:  schtasks /Query /TN XishuXijie-*"
Write-Host "Delete: schtasks /Delete /TN XishuXijie-MorningCheck /F"
