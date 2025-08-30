# 🚀 GreenH2 System Setup Guide

This guide will help you set up and run the complete Green Hydrogen Credit System with dark/light mode, analytical dashboards, and full authentication.

## 📋 Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Git**
- **MongoDB** (local or Atlas)
- **MetaMask** or similar Web3 wallet (for blockchain features)

## 🔧 Installation Steps

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd greenh2-project

# Install root dependencies
npm install
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# REACT_APP_API_URL=http://localhost:4000/api
# REACT_APP_BLOCKCHAIN_NETWORK=localhost
```

### 3. Backend Setup
```bash
cd ../backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/greenh2_credits
# JWT_SECRET=your-super-secret-jwt-key-here
# COOKIE_SECRET=your-cookie-secret-key-here
```

### 4. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas connection string in backend/.env
```

### 5. Blockchain Setup
```bash
# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## 🚀 Running the System

### Development Mode

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm start
```

#### Terminal 3: Blockchain (Optional)
```bash
npx hardhat node
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
NODE_ENV=production npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Hardhat Node**: http://localhost:8545

## 🔐 Test Accounts

The system comes with pre-configured test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Producer** | producer@example.com | password123 | Request and manage credits |
| **Certifier** | certifier@example.com | password123 | Approve credit requests |
| **Buyer** | buyer@example.com | password123 | Purchase and retire credits |
| **Auditor** | auditor@example.com | password123 | Monitor system transactions |

## 🎨 Features Overview

### 🌙 Dark/Light Mode
- **Persistent**: Theme preference survives page refresh
- **System Detection**: Automatically detects system theme
- **Manual Override**: Users can manually toggle themes
- **Smooth Transitions**: Beautiful animations between themes

### 📊 Analytics Dashboards
- **Line Charts**: Trend analysis and time series data
- **Bar Charts**: Performance comparisons and metrics
- **Pie Charts**: Distribution and composition analysis
- **Interactive**: Hover effects and tooltips
- **Responsive**: Works on all device sizes

### 🔐 Authentication System
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Role-Based Access**: Different dashboards per user role
- **Protected Routes**: Automatic redirect for unauthorized access
- **Session Management**: Automatic token refresh

### 🎯 Role-Specific Features

#### Producer Dashboard
- Credit request management
- Production analytics
- Performance tracking
- Historical data visualization

#### Certifier Dashboard
- Request review system
- Approval workflow
- Quality metrics
- Certification analytics

#### Buyer Dashboard
- Marketplace integration
- Portfolio management
- Credit retirement tools
- Transaction history

#### Auditor Dashboard
- System monitoring
- Fraud detection
- Compliance reporting
- Platform analytics

## 🛠️ Customization

### Theme Colors
Edit `frontend/tailwind.config.js` to customize:
- Primary colors (green theme)
- Secondary colors (blue theme)
- Dark mode colors
- Custom animations

### Chart Types
The system includes:
- **LineChart**: For trends and time series
- **BarChart**: For comparisons and metrics
- **PieChart**: For distributions and compositions

### Dashboard Layouts
Each role has customizable:
- Navigation menus
- Widget arrangements
- Chart configurations
- Data sources

## 🔧 Configuration Options

### Frontend Environment Variables
```bash
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DARK_MODE=true
```

### Backend Environment Variables
```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/greenh2_credits
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-cookie-secret
NODE_ENV=development
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Smart Contract Tests
```bash
npx hardhat test
```

## 📦 Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

### Smart Contract Deployment
```bash
# Testnet
npx hardhat run scripts/deploy.js --network sepolia

# Mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

## 🐛 Troubleshooting

### Common Issues

#### Frontend Won't Start
- Check Node.js version (18+ required)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

#### Backend Connection Issues
- Verify MongoDB is running
- Check environment variables
- Ensure port 4000 is available

#### Theme Not Persisting
- Check browser localStorage support
- Verify cookie settings
- Clear browser cache

#### Charts Not Rendering
- Check Recharts installation
- Verify data format
- Check console for errors

### Debug Mode
```bash
# Frontend debug
cd frontend
DEBUG=* npm start

# Backend debug
cd backend
DEBUG=* npm run dev
```

## 📚 Additional Resources

- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [React Router Documentation](https://reactrouter.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console logs
3. Check the network tab for API errors
4. Create an issue in the repository

## 🎉 Success!

Once everything is running, you should see:
- ✅ Frontend at http://localhost:3000
- ✅ Backend API at http://localhost:4000/api
- ✅ Dark/light mode toggle working
- ✅ Login system functional
- ✅ Role-based dashboards accessible
- ✅ Charts and analytics displaying

Welcome to the future of sustainable hydrogen credit management! 🌱⚡
