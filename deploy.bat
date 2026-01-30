@echo off
echo ===================================
echo CampusHire AI - Deployment to Vercel
echo ===================================
echo.
echo Step 1: Initialize Git Repository
echo.
if not exist .git (
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)
echo.
echo Step 2: Check if files are ready
echo.
if exist vercel.json (
    echo ✓ vercel.json found
) else (
    echo ✗ vercel.json missing
)
if exist DEPLOYMENT.md (
    echo ✓ DEPLOYMENT.md found
) else (
    echo ✗ DEPLOYMENT.md missing
)
echo.
echo Step 3: Next Steps
echo.
echo 1. Ensure you're logged into GitHub
echo 2. Create a new repository on GitHub
echo 3. Run these commands:
echo    git add .
echo    git commit -m "Initial commit"
echo    git remote add origin https://github.com/yourusername/campushire-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Go to https://vercel.com
echo 5. Import your GitHub repository
echo 6. Set environment variables for VITE_API_URL
echo 7. Deploy!
echo.
echo See DEPLOYMENT.md for detailed instructions
pause
