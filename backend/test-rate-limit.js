import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test rate limiting
async function testRateLimit() {
  try {
    console.log('🧪 Testing rate limiting...');
    
    // Test 1: Health check (should not be rate limited)
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check successful:', healthResponse.status);
    
    // Test 2: Auth endpoint (should not be rate limited in development)
    console.log('\n2. Testing auth endpoint...');
    const authResponse = await axios.get(`${API_BASE}/auth/me`);
    console.log('✅ Auth endpoint accessible:', authResponse.status);
    
    // Test 3: Multiple rapid requests (should not hit limit in development)
    console.log('\n3. Testing multiple rapid requests...');
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(axios.get(`${API_BASE}/health`));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Multiple requests: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.log('⚠️  Some requests failed - rate limiting might be too strict');
    } else {
      console.log('🎉 Rate limiting is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      console.log('💡 Rate limiting is too strict - check server configuration');
    }
  }
}

// Run test
testRateLimit();
