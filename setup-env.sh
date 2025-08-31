#!/bin/bash

echo "Setting up environment files for Green Hydrogen Credit System..."
echo

echo "Creating backend/.env file..."
cat > backend/.env << EOF
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenh2_credits
JWT_SECRET=greenh2-super-secret-jwt-key-2024
COOKIE_SECRET=greenh2-cookie-secret-key-2024
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
EOF

echo "Creating frontend/.env file..."
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
REACT_APP_CHAIN_ID=1337
REACT_APP_RPC_URL=http://localhost:8545
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DARK_MODE=true
EOF

echo
echo "✅ Environment files created successfully!"
echo
echo "Backend .env created at: backend/.env"
echo "Frontend .env created at: frontend/.env"
echo
echo "You can now start the project with:"
echo "  ./start-project.sh"
echo

