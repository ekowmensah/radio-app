@echo off
echo Building Radio App for XAMPP...
call npm run build
echo.
echo Copying files to root directory...
xcopy /E /I /Y dist\* .
echo.
echo Deployment complete!
echo Access your app at: http://localhost/radioapp
pause
