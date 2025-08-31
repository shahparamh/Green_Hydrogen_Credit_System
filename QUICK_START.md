# 🚀 Quick Start Guide - Green Hydrogen Credit System

## Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

## 🏃‍♂️ Quick Start (Windows)
1. **Setup Environment**: Double-click `setup-env.bat`
2. **Start System**: Double-click `start-project.bat`
3. **Open Browser**: Go to http://localhost:3000

## 🏃‍♂️ Quick Start (Mac/Linux)
1. **Setup Environment**: `chmod +x setup-env.sh && ./setup-env.sh`
2. **Start System**: `chmod +x start-project.sh && ./start-project.sh`
3. **Open Browser**: Go to http://localhost:3000

## 🔧 Manual Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup

#### Option A: Use Setup Scripts
- **Windows**: `setup-env.bat`
- **Mac/Linux**: `./setup-env.sh`

#### Option B: Manual Setup
Create `backend/.env`:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenh2_credits
JWT_SECRET=greenh2-super-secret-jwt-key-2024
COOKIE_SECRET=greenh2-cookie-secret-key-2024
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
REACT_APP_CHAIN_ID=1337
REACT_APP_RPC_URL=http://localhost:8545
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DARK_MODE=true
```

### 3. Start Servers

#### Option A: Use Startup Scripts
- **Windows**: `start-project.bat`
- **Mac/Linux**: `./start-project.sh`

#### Option B: Manual Start
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/api/health
- **Test Endpoint**: http://localhost:4000/api/test

## 🧪 Testing the System

### Quick Test
```bash
# Test backend only
node test-auth.js

# Test entire system
node test-system.js
```

### Manual Testing
1. Open http://localhost:3000
2. Click "Create Account"
3. Register as a Producer
4. Login and explore dashboard
5. Create a credit request
6. Test all features

## 👥 Test Users
The system supports these roles:
- **Producer**: Create and manage credit requests
- **Certifier**: Approve/reject credit requests
- **Buyer**: Purchase and retire credits
- **Auditor**: Monitor system transactions
- **Regulator**: Oversee compliance

## 🚨 Troubleshooting

### "Session expired please login again" Error
**Solution**: 
1. Clear browser cookies and localStorage
2. Restart both servers
3. Check environment variables are set correctly
4. Verify MongoDB is running

### Backend won't start?
- Check if MongoDB is running: `mongod`
- Verify `.env` file exists in backend folder
- Check port 4000 is available
- Run: `node backend/test-server.js`

### Frontend won't start?
- Check if backend is running on port 4000
- Verify `.env` file exists in frontend folder
- Check port 3000 is available
- Clear browser cache

### Database connection issues?
- MongoDB must be running: `mongod`
- Check MONGODB_URI in backend/.env
- For local MongoDB: `mongod`
- For MongoDB Atlas: Use connection string

### Authentication errors?
- Check JWT_SECRET in backend/.env
- Verify COOKIE_SECRET is set
- Clear browser cookies/localStorage
- Restart both servers

### API calls failing?
- Check CORS configuration
- Verify withCredentials: true in requests
- Check network tab for errors
- Run system test: `node test-system.js`

## 📚 Next Steps
1. **Register** a new user account
2. **Login** with your credentials
3. **Explore** the dashboard for your role
4. **Create** credit requests (Producer)
5. **Approve** credits (Certifier)
6. **Trade** credits (Buyer)
7. **Monitor** system (Auditor)

## 🆘 Need Help?
- Check the console for error messages
- Run system tests: `node test-system.js`
- Review the README.md for detailed documentation
- Check the IMPLEMENTATION_SUMMARY.md for system overview

## 🎯 System Features
- ✅ User authentication & authorization
- ✅ Role-based access control
- ✅ Credit request management
- ✅ Credit certification workflow
- ✅ Marketplace for trading
- ✅ Transaction monitoring
- ✅ Audit logging
- ✅ Fraud detection
- ✅ Analytics & reporting
- ✅ Blockchain integration ready

## 🔧 Development Commands
```bash
# Test backend
cd backend && npm test

# Test frontend
cd frontend && npm test

# Test contracts
npm run test:contracts

# Lint code
npm run lint

# Build for production
cd frontend && npm run build
```

Happy coding! 🌱💚
