@echo off
echo ========================================
echo Building Radio App for cPanel
echo ========================================
echo.
echo Step 1: Cleaning old files...
del /Q index.html logo.svg radio-icon.svg 2>nul
rmdir /S /Q assets 2>nul

echo Step 2: Updating config for cPanel...

REM Backup current config
copy vite.config.ts vite.config.ts.bak >nul

REM Update vite.config.ts for cPanel (root path)
powershell -Command "(Get-Content vite.config.ts) -replace \"base: '/radioapp/',\", \"base: '/',\" | Set-Content vite.config.ts"

REM Create clean index.html template
powershell -Command "Set-Content -Path index.html -Value '<!doctype html>`n<html lang=\"en\">`n  <head>`n    <meta charset=\"UTF-8\" />`n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/radio-icon.svg\" />`n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />`n    <meta name=\"description\" content=\"Modern radio player app for desktop and mobile\" />`n    <title>Hope FM - 99.9Mhz</title>`n  </head>`n  <body>`n    <div id=\"root\"></div>`n    <script type=\"module\" src=\"/src/main.tsx\"></script>`n  </body>`n</html>'"

echo Step 3: Building app...
call npm run build

REM Restore original config
move /Y vite.config.ts.bak vite.config.ts >nul

echo.
echo ========================================
echo Build Complete for cPanel!
echo ========================================
echo.
echo Upload these files to your cPanel public_html:
echo.
echo   FROM dist folder:
echo   - index.html
echo   - assets/ (entire folder)
echo   - logo.svg
echo   - radio-icon.svg
echo.
echo   FROM project root:
echo   - .htaccess-cpanel (rename to .htaccess on server)
echo.
echo Your site: https://hopefm999.radcast.online
echo.
pause
