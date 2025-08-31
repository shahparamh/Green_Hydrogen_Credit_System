@echo off
echo 🚀 Starting Green Hydrogen Credit System (FIXED VERSION)
echo.

echo 📋 Checking environment...
if not exist "backend\.env" (
    echo ⚠️  Backend .env not found. Running setup...
    call setup-env.bat
)

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env not found. Running setup...
    call setup-env.bat
)

echo.
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Starting frontend application...
start "Frontend App" cmd /k "cd frontend && npm start"

echo.
echo ✅ System starting up...
echo.
echo 📊 Backend: http://localhost:4000
echo 🎨 Frontend: http://localhost:3000
echo 📋 Health Check: http://localhost:4000/api/health
echo.
echo 🎯 The user migration issue has been FIXED!
echo 👥 Existing users can now login without errors
echo 🆕 New users can register with proper fields
echo.
echo 🚀 Your Green Hydrogen Credit System is ready!
echo.
pause
