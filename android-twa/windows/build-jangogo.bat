@echo off
setlocal
cd /d "%~dp0"

echo ==========================================================
echo   Jangogo  Android (.aab) builder  -  Windows
echo ==========================================================
echo.
echo Put "jangogo-upload.keystore" in THIS folder before running.
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode
where java >nul 2>nul
if errorlevel 1 echo [!] Java not found. Bubblewrap will offer to download a JDK - choose Yes.

echo.
echo [1/3] Installing Bubblewrap CLI ...
call npm i -g @bubblewrap/cli
if errorlevel 1 goto npmfail

echo.
echo [2/3] Init TWA project. Answer the prompts like this:
echo        Application ID / package : com.jangogo.app
echo        Application name         : Jangogo
echo        Signing key              : Use existing
echo          Key store location     : .\jangogo-upload.keystore
echo          Key alias              : jangogo
echo          Password               : (the password Claude gave you)
echo        Everything else          : just press Enter
echo.
call bubblewrap init --manifest https://japan-3d-nav.vercel.app/manifest.webmanifest
if errorlevel 1 goto initfail

echo.
echo [3/3] Building .aab and .apk ...
call bubblewrap build
if errorlevel 1 goto buildfail

echo.
echo ==========================================================
echo   DONE. Output files in this folder:
echo     app-release-bundle.aab   (upload to Google Play)
echo     app-release-signed.apk   (install on your phone)
echo ==========================================================
dir /b *.aab *.apk 2>nul
goto end

:nonode
echo [X] Node.js not found. Install Node LTS from https://nodejs.org then re-run this file.
goto end
:npmfail
echo [X] npm install failed. Check your internet connection.
goto end
:initfail
echo [X] "bubblewrap init" failed.
echo     If it says 'bubblewrap' is not recognized, CLOSE this window and double-click the file again
echo     (a new terminal is needed after the global npm install).
goto end
:buildfail
echo [X] "bubblewrap build" failed. See the messages above.
goto end

:end
echo.
pause
