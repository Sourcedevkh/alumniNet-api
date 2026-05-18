@echo off
title Get Local Wi-Fi IP
echo Searching for your local Wi-Fi IPv4 address...

for /f "tokens=2 delims=:" %%G in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%G
)

:: Clean up spaces from the output
set IP=%IP: =%

echo Your computer's local IP is: %IP%
echo.
pause
