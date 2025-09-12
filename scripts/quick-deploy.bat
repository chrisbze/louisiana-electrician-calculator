@echo off
REM Service Quote Calculator - Windows Quick Deploy Script

echo 🚀 Service Quote Calculator - Quick Deploy for Windows
echo =====================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Git is installed  
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install Git from https://git-scm.com
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

echo.
echo Choose deployment option:
echo 1. Full setup (local + production)
echo 2. Local setup only  
echo 3. Production deployment only
echo 4. Exit

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto full_setup
if "%choice%"=="2" goto local_setup  
if "%choice%"=="3" goto production_deploy
if "%choice%"=="4" goto exit
goto invalid_choice

:full_setup
echo 🔧 Running full setup...
call :setup_env
call :install_deps
call :setup_database
call :init_git

set /p deploy_prod="Deploy to production? (y/n): "
if /i "%deploy_prod%"=="y" (
    call :deploy_production
)
goto success

:local_setup
echo 🔧 Running local setup...
call :setup_env
call :install_deps  
call :setup_database
call :init_git
echo.
echo ✅ Local setup complete!
echo 📝 Next steps:
echo   1. Configure DATABASE_URL in backend\.env
echo   2. Run: cd backend ^&^& npm run migrate ^&^& npm run seed
echo   3. Start development: npm run dev
goto success

:production_deploy
echo 🚀 Deploying to production...
call :deploy_production
goto success

:setup_env
echo 📝 Setting up environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Created backend\.env
)
if not exist "frontend\.env.local" (
    copy "frontend\.env.example" "frontend\.env.local"  
    echo ✅ Created frontend\.env.local
)
goto :eof

:install_deps
echo 📦 Installing dependencies...
call npm install
cd backend && call npm install && cd ..
cd frontend && call npm install && cd ..
echo ✅ Dependencies installed
goto :eof

:setup_database
echo 🗄️ Setting up database...
cd backend
call npx prisma generate
echo ✅ Prisma client generated

REM Check if DATABASE_URL is configured
findstr /c:"postgresql://" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo 🔄 Running database migrations...
    call npx prisma migrate dev --name init
    call npm run seed
    echo ✅ Database setup complete
) else (
    echo ⚠️ DATABASE_URL not configured. Please update backend\.env
)
cd ..
goto :eof

:init_git
echo 🔧 Initializing Git repository...
if exist ".git" (
    echo ✅ Git repository already exists
) else (
    git init
    git add .
    git commit -m "Initial commit: Service Quote Calculator MVP"
    echo ✅ Git repository initialized
)
goto :eof

:deploy_production
echo 🚀 Deploying to production...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Installing Railway CLI...
    call npm install -g @railway/cli
)

REM Check if Vercel CLI is installed  
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Installing Vercel CLI...
    call npm install -g vercel
)

echo 🔄 Deploying backend to Railway...
cd backend
call railway up
cd ..

echo 🔄 Deploying frontend to Vercel...
cd frontend  
call vercel --prod
cd ..

echo ✅ Production deployment complete
goto :eof

:invalid_choice
echo ❌ Invalid choice
goto exit

:success
echo.
echo 🎉 Deployment completed successfully!
echo 📖 Check DEPLOYMENT.md for detailed instructions
echo 🌐 Your app should now be accessible at your deployment URLs
goto exit

:exit
echo.
echo 👋 Deployment script finished
pause
exit /b 0