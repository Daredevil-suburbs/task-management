$files = @(
    "mobile/.gitignore",
    "mobile/App.js",
    "mobile/app.json",
    "mobile/app/_layout.js",
    "mobile/app/dashboard.js",
    "mobile/app/index.js",
    "mobile/app/login.js",
    "mobile/app/register.js",
    "mobile/assets/adaptive-icon.png",
    "mobile/assets/favicon.png",
    "mobile/assets/icon.png",
    "mobile/assets/splash-icon.png",
    "mobile/index.js",
    "mobile/package-lock.json",
    "mobile/package.json",
    "mobile/src/components/AddQuest.js",
    "mobile/src/components/QuestCard.js",
    "mobile/src/components/QuestList.js",
    "mobile/src/components/StatusPanel.js",
    "mobile/src/components/XPProgressBar.js",
    "mobile/src/context/AuthContext.js",
    "mobile/src/services/api.js",
    "mobile/src/theme.js",
    "src/main/java/com/example/taskmanagement/controller/AuthController.java",
    "src/main/java/com/example/taskmanagement/security/CorsConfig.java",
    "src/main/java/com/example/taskmanagement/security/SecurityConfig.java",
    "target/classes/com/example/taskmanagement/TaskManagementApplication.class",
    "target/classes/com/example/taskmanagement/controller/AuthController.class",
    "target/classes/com/example/taskmanagement/controller/CategoryController.class",
    "target/classes/com/example/taskmanagement/controller/TagController.class",
    "target/classes/com/example/taskmanagement/controller/TaskController.class",
    "target/classes/com/example/taskmanagement/controller/UserController.class",
    "target/classes/com/example/taskmanagement/dto/AuthDTO$AuthResponse.class",
    "target/classes/com/example/taskmanagement/dto/AuthDTO$LoginRequest.class",
    "target/classes/com/example/taskmanagement/dto/AuthDTO$RegisterRequest.class",
    "target/classes/com/example/taskmanagement/dto/AuthDTO.class",
    "target/classes/com/example/taskmanagement/dto/CategoryDTO$Request.class",
    "target/classes/com/example/taskmanagement/dto/CategoryDTO$Response.class",
    "target/classes/com/example/taskmanagement/dto/CategoryDTO.class",
    "target/classes/com/example/taskmanagement/dto/TagDTO$Request.class",
    "target/classes/com/example/taskmanagement/dto/TagDTO$Response.class",
    "target/classes/com/example/taskmanagement/dto/TagDTO.class",
    "target/classes/com/example/taskmanagement/dto/TaskDTO$CompleteResponse.class",
    "target/classes/com/example/taskmanagement/dto/TaskDTO$Request.class",
    "target/classes/com/example/taskmanagement/dto/TaskDTO$Response.class",
    "target/classes/com/example/taskmanagement/dto/TaskDTO.class",
    "target/classes/com/example/taskmanagement/dto/UserStatusDTO.class",
    "target/classes/com/example/taskmanagement/exception/GlobalExceptionHandler.class",
    "target/classes/com/example/taskmanagement/model/Category.class",
    "target/classes/com/example/taskmanagement/model/HunterRank.class",
    "target/classes/com/example/taskmanagement/model/Tag.class",
    "target/classes/com/example/taskmanagement/model/Task$Priority.class",
    "target/classes/com/example/taskmanagement/model/Task$Status.class",
    "target/classes/com/example/taskmanagement/model/Task.class",
    "target/classes/com/example/taskmanagement/model/User.class",
    "target/classes/com/example/taskmanagement/repository/CategoryRepository.class",
    "target/classes/com/example/taskmanagement/repository/TagRepository.class",
    "target/classes/com/example/taskmanagement/repository/TaskRepository.class",
    "target/classes/com/example/taskmanagement/repository/UserRepository.class",
    "target/classes/com/example/taskmanagement/security/CorsConfig.class",
    "target/classes/com/example/taskmanagement/security/JwtAuthFilter.class",
    "target/classes/com/example/taskmanagement/security/JwtUtils.class",
    "target/classes/com/example/taskmanagement/security/SecurityConfig.class",
    "target/classes/com/example/taskmanagement/service/AuthService.class",
    "target/classes/com/example/taskmanagement/service/CategoryService.class",
    "target/classes/com/example/taskmanagement/service/LevelService$1.class",
    "target/classes/com/example/taskmanagement/service/LevelService.class",
    "target/classes/com/example/taskmanagement/service/TagService.class",
    "target/classes/com/example/taskmanagement/service/TaskService$1.class",
    "target/classes/com/example/taskmanagement/service/TaskService.class",
    "target/classes/com/example/taskmanagement/service/UserService.class"
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
    git push origin main
    
    Write-Host "Waiting 15 seconds..."
    Start-Sleep -Seconds 15
}
