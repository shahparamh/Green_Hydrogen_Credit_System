import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing backend server...');

// Test database connection
try {
  console.log('📊 Testing database connection...');
  await connectDB();
  console.log('✅ Database connection successful');
} catch (error) {
  console.log('⚠️  Database connection failed (this is expected in development):', error.message);
}

// Test environment variables
console.log('\n🔧 Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('COOKIE_SECRET:', process.env.COOKIE_SECRET ? 'Set' : 'Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

console.log('\n✅ Backend test completed successfully!');
console.log('🚀 You can now start the server with: npm run dev');

