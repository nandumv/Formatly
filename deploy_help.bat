@echo off
echo ===================================================
echo   Formatly Deployment Helper
echo ===================================================
echo.

WHERE git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is NOT installed or not in your PATH.
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo After installation, restart your computer or terminal.
    echo.
    echo UNTIL THEN: You must upload the 'docs' folder manually to GitHub.
    echo 1. Go to https://github.com/nandumv/Formatly
    echo 2. Click Add file -> Upload files
    echo 3. Drag and drop the 'docs' folder (from d:\NMV\proj\docs)
    echo 4. Commit changes.
    echo.
) ELSE (
    echo [INFO] Git is installed!
    echo.
    echo Attempting to deploy...
    echo.
    git add .
    git commit -m "Deploying latest build"
    git push origin main
    echo.
    echo Done!
)
pause
