$medicalBgUrl = "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg"
$headerBgUrl = "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg"

$webClient = New-Object System.Net.WebClient

Write-Host "Downloading medical background image..."
$webClient.DownloadFile($medicalBgUrl, "frontend/src/assets/images/medical-bg.jpg")

Write-Host "Downloading header background image..."
$webClient.DownloadFile($headerBgUrl, "frontend/src/assets/images/header-bg.jpg")

Write-Host "Images downloaded successfully!" 