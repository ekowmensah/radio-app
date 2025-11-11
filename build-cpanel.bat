@echo off
echo ========================================
echo Building Radio App for cPanel
echo ========================================
echo.
echo Step 1: Cleaning old files...
del /Q index.html logo.svg radio-icon.svg 2>nul
rmdir /S /Q assets 2>nul

echo Step 2: Creating clean index.html with PWA support...
(
echo ^<!doctype html^>
echo ^<html lang="en"^>
echo   ^<head^>
echo     ^<meta charset="UTF-8" /^>
echo     ^<link rel="icon" type="image/svg+xml" href="/radio-icon.svg" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^>
echo     ^<meta name="description" content="Listen to Hope FM 99.9Mhz - Enidaso Fie! Your favorite radio station." /^>
echo     ^<title^>Hope FM - 99.9Mhz^</title^>
echo     ^<!-- PWA Meta Tags --^>
echo     ^<meta name="theme-color" content="#2563eb" /^>
echo     ^<meta name="apple-mobile-web-app-capable" content="yes" /^>
echo     ^<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /^>
echo     ^<meta name="apple-mobile-web-app-title" content="Hope FM" /^>
echo     ^<link rel="apple-touch-icon" href="/logo.svg" /^>
echo     ^<link rel="manifest" href="/manifest.json" /^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo     ^<script type="module" src="/src/main.tsx"^>^</script^>
echo   ^</body^>
echo ^</html^>
) > index.html

echo Step 3: Updating config for cPanel...

REM Backup current config
copy vite.config.ts vite.config.ts.bak >nul

REM Update vite.config.ts for cPanel (root path)
powershell -Command "(Get-Content vite.config.ts) -replace \"base: '/radioapp/',\", \"base: '/',\" | Set-Content vite.config.ts"

echo Step 4: Building app...
call npm run build

REM Restore original config
move /Y vite.config.ts.bak vite.config.ts >nul

REM Copy PWA files for cPanel
copy public\manifest-cpanel.json dist\manifest.json >nul
copy public\sw-cpanel.js dist\sw.js >nul

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
echo   - manifest.json (PWA)
echo   - sw.js (Service Worker)
echo.
echo   FROM project root:
echo   - .htaccess-cpanel (rename to .htaccess on server)
echo.
echo Your site: https://hopefm999.radcast.online
echo.
pause
