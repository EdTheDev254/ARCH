@echo off
echo Starting ARCH Project...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error installing dependencies.
        pause
        exit /b %ERRORLEVEL%
    )
)

echo Starting development server...
call npm run dev
