$files = @(
    "frontend/index.html",
    "frontend/package-lock.json",
    "frontend/package.json",
    "frontend/src/App.jsx",
    "frontend/src/components/AddQuest.jsx",
    "frontend/src/components/AddQuest.module.css",
    "frontend/src/components/QuestCard.jsx",
    "frontend/src/components/QuestCard.module.css",
    "frontend/src/components/QuestList.jsx",
    "frontend/src/components/QuestList.module.css",
    "frontend/src/components/StatusPanel.jsx",
    "frontend/src/components/StatusPanel.module.css",
    "frontend/src/context/AuthContext.jsx",
    "frontend/src/index.css",
    "frontend/src/main.jsx",
    "frontend/src/pages/AuthPage.module.css",
    "frontend/src/pages/DashboardPage.jsx",
    "frontend/src/pages/DashboardPage.module.css",
    "frontend/src/pages/LoginPage.jsx",
    "frontend/src/pages/RegisterPage.jsx",
    "frontend/src/services/api.js",
    "frontend/vite.config.js",
    "package-lock.json",
    "src/main/java/com/example/taskmanagement/security/CorsConfig.java",
    "target/classes/com/example/taskmanagement/security/CorsConfig.class",
    "target/maven-status/maven-compiler-plugin/compile/default-compile/inputFiles.lst"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) { 
        Write-Host "File $file not found, skipping..."
        continue 
    }
    Write-Host "Adding $file..."
    git add "$file"
    
    $commitMsg = "chore: sync $file"
    Write-Host "Committing $file..."
    git commit -m "$commitMsg"
    
    Write-Host "Pushing to main..."
    # Using --force-with-lease just in case, but standard push is better if clean
    git push origin main
    
    Write-Host "Waiting 15 seconds..."
    Start-Sleep -Seconds 15
}
