# 🚀 Green Hydrogen Credit System - Complete Setup Guide

This guide provides step-by-step instructions to set up the complete Green Hydrogen Credit System for development, testing, and production deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Database Setup](#database-setup)
7. [Testing](#testing)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.30.0 or higher
- **MongoDB** 5.0 or higher (or MongoDB Atlas account)

### Optional Software
- **IPFS Desktop** or IPFS node for metadata storage
- **MetaMask** or similar Web3 wallet
- **VS Code** with Solidity extensions

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for package downloads

## 🚀 Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Green_Hydrogen_Credit_System
```

### 2. Install Dependencies
```bash
# Install root dependencies (Hardhat, etc.)
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Verify Installation
```bash
# Check Node.js version
node --version  # Should be 18.0.0+

# Check npm version
npm --version   # Should be 9.0.0+

# Check Hardhat
npx hardhat --version

# Check if all dependencies are installed
npm ls --depth=0
```

## 🔗 Smart Contract Deployment

### 1. Configure Hardhat

Create or update `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
```

### 2. Environment Variables for Blockchain

Create `.env` in root directory:
```env
# Blockchain Configuration
PRIVATE_KEY=your_private_key_here
INFURA_PROJECT_ID=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key

# Network Configuration
NETWORK=localhost
```

### 3. Compile Contracts
```bash
npx hardhat compile
```

### 4. Deploy to Local Network

#### Start Local Blockchain
```bash
# Terminal 1: Start Hardhat node
npx hardhat node
```

#### Deploy Contracts
```bash
# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

Expected output:
```
🚀 Starting Green Hydrogen Credit System deployment...

📝 Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰 Account balance: 10000.0 ETH

📋 Step 1: Deploying HydrogenCredits contract...
✅ HydrogenCredits deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

📋 Step 2: Deploying TradeMarketplace contract...
✅ TradeMarketplace deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

📋 Step 3: Deploying Verification contract...
✅ Verification deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

📋 Step 4: Setting up roles and permissions...
✅ Granted CERTIFIER_ROLE to Verification contract
✅ Granted MARKETPLACE_ADMIN_ROLE to deployer

📋 Step 5: Verifying contract setup...
🔐 Verification contract has CERTIFIER_ROLE: true
🔐 Deployer has MARKETPLACE_ADMIN_ROLE: true

📋 Step 6: Saving deployment addresses...
✅ Contract addresses saved to: contract-addresses.json
✅ Contract addresses saved to: frontend/contract-addresses.json
✅ Contract addresses saved to: backend/contract-addresses.json

🎉 Deployment completed successfully!
```

### 5. Verify Contract Deployment

Check the generated `contract-addresses.json`:
```json
{
  "network": "localhost",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "deploymentTime": "2024-01-01T12:00:00.000Z",
  "contracts": {
    "HydrogenCredits": {
      "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "name": "Green Hydrogen Credits",
      "symbol": "GHC"
    },
    "TradeMarketplace": {
      "address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    },
    "Verification": {
      "address": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    }
  }
}
```

## 🖥️ Backend Configuration

### 1. Environment Setup

Navigate to backend directory:
```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/green_hydrogen
MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/green_hydrogen

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
COOKIE_SECRET=your-cookie-secret-key-here-change-this-in-production

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Blockchain Integration
BLOCKCHAIN_NETWORK=localhost
BLOCKCHAIN_RPC_URL=http://localhost:8545
HYDROGEN_CREDITS_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
TRADE_MARKETPLACE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VERIFICATION_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

# IPFS Configuration (Optional)
IPFS_GATEWAY=https://ipfs.io/ipfs/
IPFS_API_URL=https://ipfs.infura.io:5001/api/v0
IPFS_PROJECT_ID=your_ipfs_project_id
IPFS_PROJECT_SECRET=your_ipfs_project_secret
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
sudo systemctl status mongodb

# Access MongoDB shell
mongosh
```

#### Option B: MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI_ATLAS` in `.env`

### 3. Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Expected output:
```
🚀 Server running on port 4000
✅ MongoDB Connected: mongodb://localhost:27017/green_hydrogen
🔐 JWT Secret configured
🍪 Cookie Secret configured
📊 Rate limiting enabled: 100 requests per 15 minutes
🛡️ Security headers enabled
📝 Logging enabled: dev
🌐 CORS enabled for: http://localhost:3000
```

### 4. Test Backend API
```bash
# Test basic endpoint
curl http://localhost:4000/api

# Test health check
curl http://localhost:4000/api/health

# Test authentication endpoint
curl http://localhost:4000/api/auth/status
```

## 🎨 Frontend Configuration

### 1. Environment Setup

Navigate to frontend directory:
```bash
cd frontend
cp env.example .env
```

Edit `.env` with your configuration:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_API_TIMEOUT=30000

# Blockchain Configuration
REACT_APP_CHAIN_ID=1337
REACT_APP_RPC_URL=http://localhost:8545
REACT_APP_BLOCK_EXPLORER=http://localhost:8545

# Contract Addresses (auto-populated from deployment)
REACT_APP_HYDROGEN_CREDITS_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_TRADE_MARKETPLACE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
REACT_APP_VERIFICATION_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

# Feature Flags
REACT_APP_ENABLE_IPFS=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DARK_MODE=true

# External Services
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
REACT_APP_ETHERSCAN_URL=https://etherscan.io
```

### 2. Start Frontend Development Server
```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view green-hydrogen-credits in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 3. Verify Frontend Connection

Open browser to `http://localhost:3000` and check:
- ✅ Page loads without errors
- ✅ Connection to backend API
- ✅ Connection to blockchain
- ✅ Contract addresses loaded
- ✅ Wallet connection working

## 🧪 Testing

### 1. Smart Contract Tests
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/HydrogenCredits.test.js

# Run tests with coverage
npx hardhat coverage
```

### 2. Backend Tests
```bash
cd backend
npm test
```

### 3. Frontend Tests
```bash
cd frontend
npm test
```

### 4. Integration Tests
```bash
# Test complete workflow
npm run test:integration
```

## 🚀 Production Deployment

### 1. Smart Contract Deployment

#### Deploy to Testnet (Sepolia)
```bash
# Set network in .env
NETWORK=sepolia

# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia 0x... "Green Hydrogen Credits" "GHC"
```

#### Deploy to Mainnet
```bash
# Set network in .env
NETWORK=mainnet

# Deploy contracts
npx hardhat run scripts/deploy.js --network mainnet

# Verify contracts on Etherscan
npx hardhat verify --network mainnet 0x... "Green Hydrogen Credits" "GHC"
```

### 2. Backend Deployment

#### Option A: VPS/Cloud Server
```bash
# Build application
npm run build

# Set production environment
NODE_ENV=production

# Start production server
npm start
```

#### Option B: Docker Deployment
```bash
# Build Docker image
docker build -t green-hydrogen-backend .

# Run container
docker run -d \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_production_mongodb_uri \
  green-hydrogen-backend
```

### 3. Frontend Deployment

#### Build Production Version
```bash
npm run build
```

#### Deploy to Hosting Service
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag and drop `build` folder
- **AWS S3**: Upload `build` folder to S3 bucket
- **GitHub Pages**: Push to `gh-pages` branch

## 🔧 Troubleshooting

### Common Issues

#### 1. Smart Contract Deployment Fails
```bash
# Check Hardhat configuration
npx hardhat compile

# Verify network configuration
npx hardhat console --network localhost

# Check account balance
npx hardhat run scripts/check-balance.js --network localhost
```

#### 2. Backend Connection Issues
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017/green_hydrogen"

# Verify environment variables
node -e "console.log(require('dotenv').config())"

# Check port availability
netstat -tulpn | grep :4000
```

#### 3. Frontend Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check environment variables
echo $REACT_APP_API_URL

# Verify contract addresses
cat src/contract-addresses.json
```

#### 4. Blockchain Connection Issues
```bash
# Check RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Verify network ID
npx hardhat console --network localhost
> await ethers.provider.getNetwork()
```

### Performance Optimization

#### 1. Database Indexing
```javascript
// Create indexes for common queries
db.credits.createIndex({ "producer": 1 })
db.credits.createIndex({ "status": 1 })
db.transactions.createIndex({ "timestamp": -1 })
```

#### 2. Caching Strategy
```javascript
// Implement Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache credit data
client.setex(`credits:${userId}`, 300, JSON.stringify(creditData));
```

#### 3. Gas Optimization
```solidity
// Use batch operations
function batchMintCredits(address[] memory producers, uint256[] memory amounts) external {
    for(uint i = 0; i < producers.length; i++) {
        _mint(producers[i], amounts[i]);
    }
}
```

## 📚 Additional Resources

### Documentation
- [Smart Contract API Reference](./docs/contracts.md)
- [Backend API Documentation](./docs/api.md)
- [Frontend Component Library](./docs/components.md)

### Development Tools
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.io/)

### Community Support
- [GitHub Issues](../../issues)
- [Discord Community](link-to-discord)
- [Telegram Group](link-to-telegram)

---

**Need help?** Check the [troubleshooting section](#troubleshooting) or create an issue on GitHub.

**Happy coding! 🚀**
