@echo off
echo ==============================================
echo   Pushing JibonJatra BD to GitHub...
echo ==============================================
"C:\Users\USER\AppData\Local\MinGit\cmd\git.exe" push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo If prompted, please enter your GitHub username and Personal Access Token (or password).
)
pause
