while ($true) {
    # Get all untracked, modified, and deleted files, excluding node_modules and script itself
    # -o: untracked, -m: modified, -d: deleted, --exclude-standard: use .gitignore
    $files = git ls-files -o -m -d --exclude-standard | Select-String -NotMatch "node_modules|sync_v3.ps1"
    
    if (-not $files) {
        Write-Host "No more files to sync. Done!"
        break
    }

    # Pick the first file from the list
    $file = $files[0].ToString().Trim()
    
    Write-Host "--- Syncing: $file ---"
    
    # Use -A to stage the change (handles modification, addition, and deletion)
    git add "$file"
    
    $commitMsg = "chore: sync $file"
    git commit -m "$commitMsg"
    
    Write-Host "Pushing to main..."
    $pushResult = git push origin main 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed, trying to pull first..."
        git pull --rebase origin main
        git push origin main
    }
    
    Write-Host "Success. Waiting 15 seconds before next file..."
    Start-Sleep -Seconds 15
}
