import jwt from 'jsonwebtoken';

// Test JWT token verification
const testJWT = () => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  console.log('🔑 JWT Secret:', secret ? 'Set' : 'Not set');
  console.log('🔑 Secret length:', secret ? secret.length : 0);
  
  if (secret === 'your-super-secret-jwt-key-here-change-this-in-production') {
    console.log('⚠️  Using default JWT secret - this should be changed!');
  }
  
  // Test token creation
  try {
    const testToken = jwt.sign({ userId: 'test', email: 'test@test.com', role: 'test' }, secret);
    console.log('✅ JWT token creation successful');
    console.log('🔑 Test token length:', testToken.length);
    
    // Test token verification
    const decoded = jwt.verify(testToken, secret);
    console.log('✅ JWT token verification successful');
    console.log('🔑 Decoded payload:', decoded);
    
  } catch (error) {
    console.error('❌ JWT test failed:', error.message);
  }
};

// Test cookie secret
const testCookie = () => {
  const cookieSecret = process.env.COOKIE_SECRET || 'fallback-cookie-secret';
  console.log('🍪 Cookie Secret:', cookieSecret ? 'Set' : 'Not set');
  console.log('🍪 Secret length:', cookieSecret ? cookieSecret.length : 0);
  
  if (cookieSecret === 'your-cookie-secret-key-here-change-this-in-production') {
    console.log('⚠️  Using default cookie secret - this should be changed!');
  }
};

// Run tests
console.log('🧪 Running authentication tests...\n');
testJWT();
console.log('');
testCookie();
console.log('\n✅ Tests completed');


