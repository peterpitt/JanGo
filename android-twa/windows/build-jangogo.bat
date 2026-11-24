@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo ==========================================================
echo   Jangogo  Android (.aab) 一鍵打包  -  Windows
echo ==========================================================
echo.
echo 請確認「jangogo-upload.keystore」已和這個 .bat 放在同一個資料夾。
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [X] 找不到 Node.js。請先安裝 Node LTS: https://nodejs.org  安裝後重開此檔。
  pause & exit /b 1
)
where java >nul 2>nul
if errorlevel 1 (
  echo [!] 找不到 Java。沒關係，Bubblewrap 首次執行會問是否自動下載 JDK，請選 Yes。
)

echo.
echo [1/3] 安裝 Bubblewrap CLI （已安裝會略過）...
call npm i -g @bubblewrap/cli
if errorlevel 1 ( echo [X] npm 安裝失敗，請檢查網路。 & pause & exit /b 1 )

echo.
echo [2/3] 初始化 TWA 專案...
echo      會問你幾個問題，照下面回答（詳見 README-windows.md）:
echo        - Application ID / package      : com.jangogo.app
echo        - Application name              : Jangogo
echo        - Signing key                  : 選「Use existing（既有）」
echo            Key store location         : .\jangogo-upload.keystore
echo            Key alias                  : jangogo
echo            密碼                        : 見 Claude 對話中提供的密碼
echo        - 其他（顏色/方向等）直接 Enter 用預設即可
echo.
call bubblewrap init --manifest https://japan-3d-nav.vercel.app/manifest.webmanifest
if errorlevel 1 ( echo [X] init 失敗。 & pause & exit /b 1 )

echo.
echo [3/3] 建置 .aab 與 .apk ...
call bubblewrap build
if errorlevel 1 ( echo [X] build 失敗。 & pause & exit /b 1 )

echo.
echo ==========================================================
echo   完成！在本資料夾會看到：
echo     app-release-bundle.aab   ^<-- 上傳 Google Play 封閉測試
echo     app-release-signed.apk   ^<-- 可直接裝到你手機自測
echo ==========================================================
dir /b *.aab *.apk 2>nul
pause
