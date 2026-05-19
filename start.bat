@echo off
echo =========================================
echo   Starting Event Management System...
echo =========================================
echo.

:: Navigate to the client directory
cd client

:: Start the Vite development server and automatically open the browser
echo Starting Frontend Server...
npm run dev -- --open
