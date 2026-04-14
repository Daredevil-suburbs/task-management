# sync_v4_ordered.ps1
# This script commits and pushes changed files one by one with a 15-second delay,
# sorting them to ensure "similar" files (in the same directory) are processed sequentially.

while ($true) {
    # Get all untracked, modified, and deleted files, excluding node_modules and sync scripts
    $files = @(git ls-files -o -m -d --exclude-standard | 
             Where-Object { $_ -notmatch "node_modules|sync_.*\.ps1|target/" } | 
             Sort-Object)

    if ($files.Count -eq 0) {
        Write-Host "No more source files to sync. Checking for tracked target files..."
        # Optional: check if there are tracked target files that were excluded above
        $targetFiles = @(git ls-files -m | Where-Object { $_ -match "target/" } | Sort-Object)
        if ($targetFiles.Count -eq 0) {
            Write-Host "All done!"
            break
        }
        $files = $targetFiles
    }

    $file = $files[0]
    if ($file -is [System.Management.Automation.PSCustomObject]) { $file = $file.ToString() }
    
    Write-Host "`n--- Syncing: $file ---"
    
    git add "$file"
    
    $commitMsg = "chore: sync $file"
    git commit -m "$commitMsg"
    
    Write-Host "Pushing to main..."
    git push origin main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed, attempting to pull and rebase..."
        git pull --rebase origin main
        git push origin main
    }
    
    Write-Host "Success! Waiting 15 seconds before the next sync..."
    Start-Sleep -Seconds 15
}
