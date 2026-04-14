$authorName = "Daredevil-suburbs"
$signature = "/** `r`n * @author $authorName`r`n */`r`n"
$signatureOneLine = "// @author $authorName`r`n"

$files = Get-ChildItem -Path "src", "frontend" -Recurse -File -Exclude "node_modules", "target", "dist", ".git", ".next" | Where-Object { 
    $_.Extension -in ".java", ".js", ".jsx", ".ts", ".tsx" 
}

$count = 0
foreach ($file in $files) {
    if ($file.FullName -match "node_modules|target\\|dist\\") { continue }
    
    $content = Get-Content -Path $file.FullName -Raw
    if ($null -ne $content -and -not $content.StartsWith("/** `r`n * @author") -and -not $content.StartsWith("// @author")) {
        Set-Content -Path $file.FullName -Value ($signature + $content) -NoNewline
        $count++
    }
}

Write-Output "Successfully added signature to $count files!"
