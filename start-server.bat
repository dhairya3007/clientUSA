@echo off
title ZEROPOINT Local IIS Express Server (Port 8088)
echo ==============================================================
echo   ZEROPOINT - Local ASP.NET Email & Web Server
echo ==============================================================
echo   Running on: http://localhost:8088/
echo   Email Endpoint: http://localhost:8088/emailmodule/send-email.ashx
echo   Keep this window open while testing forms locally.
echo ==============================================================
echo.
if exist "C:\Program Files\IIS Express\iisexpress.exe" (
    "C:\Program Files\IIS Express\iisexpress.exe" /path:"%~dp0." /port:8088
) else if exist "C:\Program Files (x86)\IIS Express\iisexpress.exe" (
    "C:\Program Files (x86)\IIS Express\iisexpress.exe" /path:"%~dp0." /port:8088
) else (
    echo Error: IIS Express was not found in Program Files.
    pause
)

