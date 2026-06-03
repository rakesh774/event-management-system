@echo off
echo =========================================
echo   Starting Event Management System...
echo =========================================
echo.

:: Start MongoDB (if installed as a service, it's usually already running, but this ensures it)
:: net start MongoDB >nul 2>&1

:: Start the Backend Server in a new command window
echo Starting Backend Server on port 5000...
start "EventMaster Backend" cmd /k "cd server && npm run dev"

:: Start the Frontend Server in a new command window
echo Starting Frontend Server...
start "EventMaster Frontend" cmd /k "cd client && npm run dev -- --open"

echo.
echo Both servers are starting up! 
echo The frontend will automatically open in your browser shortly.
