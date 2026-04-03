$files = @("target/classes/com/example/taskmanagement/dto/AuthDTO$AuthResponse.class","target/classes/com/example/taskmanagement/dto/AuthDTO$LoginRequest.class","target/classes/com/example/taskmanagement/dto/AuthDTO$RegisterRequest.class","target/classes/com/example/taskmanagement/dto/CategoryDTO$Request.class","target/classes/com/example/taskmanagement/dto/CategoryDTO$Response.class","target/classes/com/example/taskmanagement/dto/TagDTO$Request.class","target/classes/com/example/taskmanagement/dto/TagDTO$Response.class","target/classes/com/example/taskmanagement/dto/TaskDTO$CompleteResponse.class","target/classes/com/example/taskmanagement/dto/TaskDTO$Request.class","target/classes/com/example/taskmanagement/dto/TaskDTO$Response.class","target/classes/com/example/taskmanagement/model/Task$Priority.class","target/classes/com/example/taskmanagement/model/Task$Status.class","target/classes/com/example/taskmanagement/service/LevelService$1.class","target/classes/com/example/taskmanagement/service/TaskService$1.class")
foreach ($file in $files) {
    if (-not $file) { continue }
    git add "$file"
    git commit -m "chore: sync $file"
    # git pull --rebase origin main  # Skip pull for now to avoid merge conflicts in background
    git push origin main
    Start-Sleep -Seconds 60
}
