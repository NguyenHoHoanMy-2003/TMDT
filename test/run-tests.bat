@echo off
REM ========================================
REM Test Runner for Nghe Quang Nam Website
REM ========================================

echo.
echo ========================================
echo   TEST SUITE - Nghe Quang Nam Website
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo [INFO] Starting HTTP Server on port 8000...
echo.

REM Start server in background
start /B python -m http.server 8000 --directory "%~dp0.."

REM Wait for server to start
timeout /t 2 /nobreak >nul

echo [SUCCESS] Server started at http://localhost:8000
echo.
echo Opening test page in browser...
echo.

REM Open test page in default browser
start http://localhost:8000/test/test-functions.html

echo.
echo ========================================
echo   Quick Guide:
echo ========================================
echo 1. Click "Chay Tat Ca Tests" to run all tests
echo 2. View results and bug reports
echo 3. Check BUG-REPORT.md for details
echo 4. See bug-fixes.js for solutions
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Keep window open
pause
