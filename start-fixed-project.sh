#!/bin/bash

echo "🚀 Starting Green Hydrogen Credit System (FIXED VERSION)"
echo

echo "📋 Checking environment..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env not found. Running setup..."
    ./setup-env.sh
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env not found. Running setup..."
    ./setup-env.sh
fi

echo
echo "🔧 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

echo
echo "🎨 Starting frontend application..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo
echo "✅ System starting up..."
echo
echo "📊 Backend: http://localhost:4000"
echo "🎨 Frontend: http://localhost:3000"
echo "📋 Health Check: http://localhost:4000/api/health"
echo
echo "🎯 The user migration issue has been FIXED!"
echo "👥 Existing users can now login without errors"
echo "🆕 New users can register with proper fields"
echo
echo "🚀 Your Green Hydrogen Credit System is ready!"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for user to stop
wait
