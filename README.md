<<<<<<< HEAD
# Green_Hydrogen_Credit_System
=======
# 🌱 GreenH2 - Blockchain-Based Green Hydrogen Credit System

A comprehensive blockchain-based platform for tracking, issuing, transferring, and retiring credits for certified green hydrogen production. The system ensures transparency, immutability, and traceability of each credit through blockchain technology.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with HTTP-only cookies
- **Role-based access control** for all stakeholders
- **Secure password hashing** with bcrypt
- **Session management** with refresh tokens

### 👥 Multi-Stakeholder Platform
- **Producers**: Request and manage green hydrogen credits
- **Certifiers**: Verify and approve credit issuance requests
- **Buyers**: Purchase and retire credits from marketplace
- **Auditors**: Monitor all transactions and detect fraud

### 📊 Analytics & Dashboards
- **Real-time analytics** for all stakeholders
- **Interactive charts** and data visualization
- **Performance metrics** and trend analysis
- **Customizable dashboards** per user role

### 🌙 Dark/Light Mode
- **Persistent theme preference** (survives page refresh)
- **System theme detection** with manual override
- **Smooth transitions** between themes
- **Consistent theming** across all components

### 🔗 Blockchain Integration
- **Smart contract integration** for credit management
- **Immutable transaction history** on blockchain
- **Credit uniqueness verification** preventing double counting
- **Transparent audit trail** for all operations

## 🛠️ Technology Stack

### Frontend
- **React 19** with modern hooks and patterns
- **TailwindCSS** for utility-first styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Helmet** for security headers
- **Rate limiting** and CORS protection

### Blockchain
- **Solidity** smart contracts
- **Hardhat** development environment
- **Ethers.js** for blockchain interaction
- **OpenZeppelin** for secure contract patterns

## 📁 Project Structure

```
project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Theme, Auth)
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── routes/              # API route handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB models
│   ├── config/              # Configuration files
│   └── package.json         # Backend dependencies
├── contracts/                # Solidity smart contracts
├── scripts/                  # Deployment and utility scripts
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **MongoDB** (local or Atlas)
- **MetaMask** or similar Web3 wallet
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd greenh2-project
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install root dependencies (for blockchain)
cd ..
npm install
```

### 3. Environment Configuration

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
# Edit .env with your configuration
```

#### Backend (.env)
```bash
cd backend
cp env.example .env
# Edit .env with your configuration
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

### 6. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Hardhat Node**: http://localhost:8545

## 🔧 Configuration

### Environment Variables

#### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_BLOCKCHAIN_NETWORK`: Blockchain network name
- `REACT_APP_CONTRACT_ADDRESSES`: JSON string of contract addresses

#### Backend
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `COOKIE_SECRET`: Secret key for cookie signing
- `PORT`: Server port (default: 4000)

### Smart Contract Configuration
- Update contract addresses in `frontend/src/contract-addresses.json`
- Configure network settings in `hardhat.config.js`

## 📊 Dashboard Features

### Producer Dashboard
- **Credit Request Management**: Submit and track credit requests
- **Production Analytics**: Monitor hydrogen production metrics
- **Credit Balance**: View issued and pending credits
- **Performance Trends**: Historical data visualization

### Certifier Dashboard
- **Request Review**: Approve or reject credit requests
- **Verification Tools**: Document and evidence review
- **Approval Analytics**: Track certification metrics
- **Quality Assurance**: Maintain certification standards

### Buyer Dashboard
- **Marketplace**: Browse and purchase available credits
- **Portfolio Management**: Track owned credits
- **Retirement Tools**: Retire credits for sustainability goals
- **Transaction History**: Complete audit trail

### Auditor Dashboard
- **System Monitoring**: Real-time transaction monitoring
- **Fraud Detection**: Automated anomaly detection
- **Compliance Reports**: Regulatory compliance verification
- **System Analytics**: Platform-wide performance metrics

## 🔒 Security Features

- **JWT Authentication** with secure cookie storage
- **Role-based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection** for cross-origin requests
- **Helmet Security Headers**
- **Password Hashing** with bcrypt

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Smart contract tests
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
# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Wiki](../../wiki) for detailed guides
- **Issues**: Report bugs and request features via [GitHub Issues](../../issues)
- **Discussions**: Join community discussions in [GitHub Discussions](../../discussions)

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract patterns
- **TailwindCSS** for the utility-first CSS framework
- **Recharts** for beautiful data visualization
- **React Community** for the amazing frontend framework

---

**Made with ❤️ for a sustainable future powered by green hydrogen**
>>>>>>> aba8189 (Initial commit)
