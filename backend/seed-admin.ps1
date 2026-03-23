# PowerShell script to create admin user via API or direct database
# This script will help you create an admin user

Write-Host "Creating admin user..." -ForegroundColor Green

# Option 1: Use SQL to insert directly (requires SQL connection)
# Option 2: We'll create a simple C# console app or use the API

Write-Host "`nTo create an admin user, you have two options:" -ForegroundColor Yellow
Write-Host "1. Run the SQL script: seed-admin.sql" -ForegroundColor Cyan
Write-Host "2. Manually insert via SQL Server Management Studio" -ForegroundColor Cyan
Write-Host "`nDefault Admin Credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@tuitionplatform.com" -ForegroundColor White
Write-Host "Password: Admin123!" -ForegroundColor White
Write-Host "`nNote: You'll need to generate a BCrypt hash for the password." -ForegroundColor Gray

