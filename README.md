# 🌱 Green Hydrogen Credit System

> **Blockchain-Based Green Hydrogen Credit System** - A decentralized platform for minting, trading, and retiring verified green hydrogen credits with full transparency and audit trails.

## 🎯 Project Overview

The Green Hydrogen Credit System is a comprehensive blockchain solution that enables the creation, verification, trading, and retirement of green hydrogen credits. This system addresses the critical need for transparent and verifiable carbon offset mechanisms in the hydrogen economy.

### 🌟 Key Features

- **🔐 Role-Based Access Control**: Secure role management for producers, certifiers, buyers, auditors, and regulators
- **📜 Certificate Management**: Unique, non-fungible certificates for each hydrogen production batch
- **🔄 Decentralized Trading**: Peer-to-peer marketplace for credit trading
- **✅ Verification System**: Multi-layered verification process with oracle support
- **📊 Full Audit Trail**: Complete transparency with blockchain-based logging
- **🛡️ Security First**: Built with OpenZeppelin contracts and best practices
- **🌐 IPFS Integration**: Decentralized storage for certificate metadata

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)      │◄──►│   (Ethereum)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   IPFS Storage  │    │   MongoDB        │    │   Smart        │
│   (Metadata)    │    │   (Events)       │    │   Contracts    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Smart Contracts

### 1. **HydrogenCredits.sol**
- ERC20 token representing green hydrogen credits
- Role-based access control for all operations
- Certificate tracking with unique identifiers
- Pausable functionality for emergency situations

### 2. **TradeMarketplace.sol**
- Decentralized marketplace for credit trading
- Support for both buy and sell orders
- Escrow functionality for secure transactions
- Platform fee management

### 3. **Verification.sol**
- Verification system for hydrogen production
- Oracle integration for automated verification
- Request management with timeout handling
- Multi-verifier support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Hardhat development environment
- MongoDB (for backend)
- MetaMask or similar wallet
- IPFS node (optional, for metadata storage)

### 1. Clone and Install

```bash
git clone <repository-url>
cd Green_Hydrogen_Credit_System
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Setup

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/green_hydrogen
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
COOKIE_SECRET=your-cookie-secret-key-here-change-this-in-production
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_CHAIN_ID=1337
REACT_APP_RPC_URL=http://localhost:8545
```

### 3. Deploy Smart Contracts

```bash
# Start local blockchain
npx hardhat node

# In new terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

### 5. Start Frontend

```bash
cd frontend
npm start
```

## 🔄 Complete Workflow Example

### Producer → Certifier → Buyer → Auditor Flow

#### 1. **Producer Requests Verification**
```javascript
// Producer submits verification request
const requestId = await verification.requestVerification(
  1000, // 1000 credits
  "QmMetadataHash123", // IPFS hash
  "Solar Farm Alpha, California",
  "Solar Electrolysis",
  50 // gCO2/kWh
);
```

#### 2. **Certifier Approves Production**
```javascript
// Certifier completes verification
await verification.completeVerification(
  requestId,
  true, // approved
  "Production verified - meets green hydrogen standards"
);
// Credits are automatically minted to producer
```

#### 3. **Producer Lists Credits for Sale**
```javascript
// Producer creates marketplace listing
const orderId = await marketplace.placeSellOrder(
  500, // 500 credits
  ethers.utils.parseEther("0.01"), // 0.01 ETH per credit
  "High-quality solar hydrogen credits",
  [1, 2] // certificate IDs
);
```

#### 4. **Buyer Purchases Credits**
```javascript
// Buyer fills the order
await marketplace.fillSellOrder(orderId, {
  value: ethers.utils.parseEther("5") // 500 * 0.01 ETH
});
// Credits transferred to buyer, ETH to producer
```

#### 5. **Buyer Retires Credits**
```javascript
// Buyer retires credits for carbon offset
await hydrogenCredits.retireCredits(
  200, // 200 credits
  [3, 4], // certificate IDs
  "Corporate sustainability initiative"
);
// Credits burned, certificate marked as retired
```

#### 6. **Auditor Reviews System**
```javascript
// Auditor can view all transactions and certificates
const certificates = await hydrogenCredits.getCertificate(1);
const transactions = await marketplace.getOrder(1);
// Full audit trail available on blockchain
```

## 🧪 Testing

### Run Smart Contract Tests
```bash
npx hardhat test
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security Features

- **OpenZeppelin Contracts**: Industry-standard secure smart contracts
- **Role-Based Access Control**: Granular permissions for different user types
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Pausable Operations**: Emergency pause functionality
- **Input Validation**: Comprehensive parameter validation
- **Event Logging**: Full transparency and audit trails

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Credit Management
- `GET /api/credits/user` - Get user's credits
- `POST /api/credits/request` - Request credit verification
- `PUT /api/credits/:id/status` - Update credit status
- `POST /api/credits/retire` - Retire credits

### Marketplace
- `GET /api/marketplace/listings` - Get active listings
- `POST /api/marketplace/list` - Create listing
- `POST /api/marketplace/buy/:id` - Buy credits

### Audit & Analytics
- `GET /api/audit/transactions` - Get transaction history
- `GET /api/audit/certificates` - Get certificate details
- `GET /api/analytics/overview` - System overview

## 🌐 Network Configuration

### Supported Networks
- **Localhost**: Development and testing
- **Sepolia**: Ethereum testnet
- **Polygon Mumbai**: Polygon testnet
- **Mainnet**: Production deployment

### Network Configuration
```javascript
// hardhat.config.js
networks: {
  sepolia: {
    url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
    accounts: [PRIVATE_KEY]
  },
  polygon: {
    url: `https://polygon-rpc.com`,
    accounts: [PRIVATE_KEY]
  }
}
```

## 📈 Performance & Scalability

- **Gas Optimization**: Efficient smart contract design
- **Batch Operations**: Support for multiple operations in single transaction
- **Lazy Loading**: Frontend optimization for large datasets
- **Caching**: Backend caching for frequently accessed data
- **Indexing**: Database indexing for fast queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Solidity style guide
- Write comprehensive tests
- Update documentation
- Use conventional commits
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@greenh2.com

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for development framework
- Ethereum Foundation for blockchain infrastructure
- Green Hydrogen community for feedback and testing

**Built with ❤️ by the Cache Me If You Can Team**

*Empowering the future of sustainable energy through blockchain technology*
