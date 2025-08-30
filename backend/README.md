# Backend API Documentation

## Overview
This backend provides a comprehensive API for the Blockchain-Based Green Hydrogen Credit System. It includes user management, credit management, marketplace operations, transaction handling, and audit logging.

## API Base URL
```
http://localhost:4000/api
```

## Authentication
All protected routes require JWT authentication via HTTP-only cookies. Include the `Authorization` header with the JWT token for protected endpoints.

## Controllers

### 1. User Controller (`/api/users`)

#### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users with pagination and filtering | Admin |
| GET | `/stats` | Get user statistics and analytics | Admin |
| GET | `/:id` | Get user by ID | Owner/Admin |
| PUT | `/:id` | Update user profile | Owner/Admin |
| PATCH | `/:id/status` | Update user status | Admin |
| DELETE | `/:id` | Soft delete user | Admin |

#### Features
- Role-based access control
- Pagination and filtering
- User statistics and analytics
- Soft delete functionality
- Comprehensive audit logging

### 2. Credit Controller (`/api/credits`)

#### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all credits with filtering | All |
| GET | `/stats` | Get credit statistics | All |
| GET | `/user/:userId` | Get credits by user | Owner/Admin |
| POST | `/request` | Create credit request | Producer |
| PUT | `/:id/status` | Update credit status | Certifier/Admin |
| GET | `/:id` | Get credit by ID | Owner/Admin |
| POST | `/:id/transfer` | Transfer credits to buyer | Owner/Admin |

#### Features
- Credit lifecycle management
- Status transition validation
- Producer certification workflow
- Credit transfer functionality
- Environmental data tracking

### 3. Marketplace Controller (`/api/marketplace`)

#### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all marketplace listings | All |
| GET | `/stats` | Get marketplace statistics | All |
| POST | `/list` | Create marketplace listing | Producer |
| POST | `/buy/:listingId` | Buy credits from listing | Buyer |
| GET | `/:id` | Get listing by ID | All |
| PUT | `/:id` | Update listing | Owner/Admin |
| DELETE | `/:id` | Cancel listing | Owner/Admin |

#### Features
- Credit marketplace operations
- Price filtering and search
- Location-based filtering
- Listing management
- Purchase workflow

### 4. Transaction Controller (`/api/transactions`)

#### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all transactions | All |
| GET | `/stats` | Get transaction statistics | All |
| GET | `/user/:userId` | Get transactions by user | Owner/Admin |
| GET | `/:id` | Get transaction by ID | Owner/Admin |
| PUT | `/:id/status` | Update transaction status | Admin |
| POST | `/` | Create manual transaction | Admin |
| POST | `/:id/retire` | Retire credits | Buyer/Admin |

#### Features
- Transaction lifecycle management
- Status transition validation
- Financial transaction tracking
- Credit retirement functionality
- Comprehensive reporting

### 5. Audit Controller (`/api/audit`)

#### Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all audit logs | Admin |
| GET | `/fraud` | Get fraud detection alerts | Admin |
| GET | `/compliance` | Get compliance report | Admin |
| GET | `/analytics` | Get audit analytics | Admin |
| GET | `/export` | Export audit logs | Admin |
| GET | `/user/:userId` | Get audit logs by user | Owner/Admin |
| POST | `/` | Create audit log entry | All |

#### Features
- Comprehensive audit logging
- Fraud detection and alerts
- Compliance reporting
- Analytics and trends
- Export functionality

## Data Models

### User Model
- Basic info (name, email, password)
- Role-based access (producer, certifier, buyer, auditor, admin)
- Profile information
- Company details
- Blockchain wallet address
- Two-factor authentication
- Status tracking

### Credit Model
- Production details
- Environmental data
- Certification information
- Status tracking
- Audit trail
- Blockchain integration
- Transfer history

### Transaction Model
- Transaction types
- Financial details
- Blockchain information
- Status tracking
- Compliance data
- Audit trail

### MarketplaceListing Model
- Credit information
- Pricing details
- Seller information
- Listing status
- Analytics data
- Environmental impact

### AuditLog Model
- Action tracking
- User information
- Resource details
- Security metrics
- Performance data
- Compliance tracking

## Security Features

### Authentication & Authorization
- JWT-based authentication
- HTTP-only cookies
- Role-based access control (RBAC)
- Two-factor authentication support

### Security Middleware
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Audit & Compliance
- Comprehensive audit logging
- Fraud detection
- Compliance reporting
- Data retention policies
- Security monitoring

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Applied to all API endpoints

## Environment Variables

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/greenh2_credits

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Development

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Running the Server
```bash
# Development
npm run dev

# Production
npm start
```

### Database Setup
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas
# Set MONGODB_URI in .env
```

## Testing

### API Testing
Use tools like Postman, Insomnia, or curl to test the API endpoints.

### Example Requests

#### Create Credit Request
```bash
curl -X POST http://localhost:4000/api/credits/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productionDetails": {
      "facilityName": "Green H2 Plant",
      "location": "Solar Farm, CA"
    },
    "environmentalData": {
      "energySource": "solar",
      "emissionsReduction": 1000
    },
    "estimatedCredits": 100
  }'
```

#### Get Marketplace Listings
```bash
curl -X GET "http://localhost:4000/api/marketplace?page=1&limit=10&minPrice=50&maxPrice=200" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Monitoring & Logging

### Logging
- Morgan for HTTP request logging
- Custom audit logging
- Error logging with stack traces
- Performance monitoring

### Health Checks
- `/api/health` endpoint
- Database connectivity status
- System resource monitoring

## Deployment

### Production Considerations
- Environment variable configuration
- Database optimization
- SSL/TLS configuration
- Load balancing
- Monitoring and alerting
- Backup strategies

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## Support

For questions or issues, please refer to the main project documentation or create an issue in the project repository.




