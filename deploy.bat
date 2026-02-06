@echo off
echo ========================================
echo Arcadia Health - Deployment Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [OK] Prerequisites met
echo.

echo Select deployment option:
echo 1) Deploy Backend to Render
echo 2) Deploy Frontend to Vercel
echo 3) Deploy Both (Render + Vercel)
echo 4) Build for production (local)
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto fullstack
if "%choice%"=="4" goto build
goto invalid

:backend
echo.
echo [INFO] Deploying Backend to Render...
echo.
echo Please follow these steps:
echo 1. Go to https://render.com
echo 2. Sign up/Login with GitHub
echo 3. Click 'New +' - 'Blueprint'
echo 4. Connect your repository
echo 5. Render will auto-detect render.yaml
echo 6. Set environment variables in dashboard
echo.
echo render.yaml is already configured in the project root
goto end

:frontend
echo.
echo [INFO] Deploying Frontend to Vercel...
cd client

REM Check if vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

echo Running Vercel deployment...
call vercel --prod

echo.
echo [SUCCESS] Frontend deployed!
goto end

:fullstack
echo.
echo [INFO] Deploying Full Stack...
echo.
echo Step 1: Deploy Backend to Render
echo ================================
echo 1. Go to https://render.com
echo 2. Sign up/Login with GitHub
echo 3. Click 'New +' - 'Blueprint'
echo 4. Connect your repository
echo 5. Set environment variables
echo.
pause

echo.
echo Step 2: Deploy Frontend to Vercel
echo ==================================
cd client

where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

set /p backend_url="Enter your backend URL (e.g., https://your-app.onrender.com): "

echo Setting environment variable...
call vercel env add VITE_API_URL production

echo Deploying frontend...
call vercel --prod

echo.
echo [SUCCESS] Full stack deployed!
goto end

:build
echo.
echo [INFO] Building for production...

REM Build backend
echo Building backend...
cd server
call npm install
echo [OK] Backend ready

REM Build frontend
echo Building frontend...
cd ..\client
call npm install
call npm run build
echo [OK] Frontend built to client/dist

echo.
echo Production builds complete!
echo Backend: server/
echo Frontend: client/dist/
goto end

:invalid
echo [ERROR] Invalid choice
exit /b 1

:end
echo.
echo ========================================
echo Deployment process complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test your deployed application
echo 2. Set up custom domain (optional)
echo 3. Configure monitoring
echo.
echo For detailed instructions, see DEPLOYMENT.md
pause
