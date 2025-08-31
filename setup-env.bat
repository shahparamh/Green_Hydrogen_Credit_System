@echo off
echo Setting up environment files for Green Hydrogen Credit System...
echo.

echo Creating backend/.env file...
(
echo PORT=4000
echo NODE_ENV=development
echo MONGODB_URI=mongodb://localhost:27017/greenh2_credits
echo JWT_SECRET=greenh2-super-secret-jwt-key-2024
echo COOKIE_SECRET=greenh2-cookie-secret-key-2024
echo BCRYPT_ROUNDS=12
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=1000
) > backend\.env

echo Creating frontend/.env file...
(
echo REACT_APP_API_URL=http://localhost:4000/api
echo REACT_APP_BLOCKCHAIN_NETWORK=localhost
echo REACT_APP_CHAIN_ID=1337
echo REACT_APP_RPC_URL=http://localhost:8545
echo REACT_APP_ENABLE_ANALYTICS=true
echo REACT_APP_ENABLE_NOTIFICATIONS=true
echo REACT_APP_ENABLE_DARK_MODE=true
) > frontend\.env

echo.
echo ✅ Environment files created successfully!
echo.
echo Backend .env created at: backend\.env
echo Frontend .env created at: frontend\.env
echo.
echo You can now start the project with:
echo   start-project.bat
echo.
pause

