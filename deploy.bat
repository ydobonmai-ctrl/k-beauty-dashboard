@echo off
echo ==========================================
echo   K-Beauty Dashboard One-Click Deploy
echo ==========================================
echo.
echo 1. Connecting to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/ydobonmai-ctrl/k-beauty-dashboard.git
git branch -M main
echo.
echo 2. Pushing code... (GitHub login window may appear)
git push -u origin main
echo.
echo 3. Deploying to Vercel...
npx vercel --prod
echo.
echo ==========================================
echo   Deployment Finished!
echo ==========================================
pause
