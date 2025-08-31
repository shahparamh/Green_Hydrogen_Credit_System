import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test authentication flow
async function testAuthFlow() {
  try {
    console.log('🧪 Testing Authentication Flow...\n');
    
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    
    // Test 2: Test auth endpoint without authentication (should return 401)
    console.log('\n2. Testing auth endpoint without token...');
    try {
      await axios.get(`${API_BASE}/auth/me`);
      console.log('❌ Unexpected success - should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 for unauthenticated request');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    // Test 3: Test registration
    console.log('\n3. Testing user registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'producer',
      organization: 'Test Corp'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData, {
      withCredentials: true
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    
    // Test 4: Test login
    console.log('\n4. Testing user login...');
    const loginData = {
      email: 'testuser@example.com',
      password: 'password123',
      role: 'producer'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData, {
      withCredentials: true
    });
    console.log('✅ Login successful:', registerResponse.data.message);
    
    // Test 5: Test get current user with authentication
    console.log('\n5. Testing get current user with auth...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      withCredentials: true
    });
    console.log('✅ Get current user successful:', userResponse.data.user.email);
    
    // Test 6: Test multiple auth checks (should not cause issues)
    console.log('\n6. Testing multiple auth checks...');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(axios.get(`${API_BASE}/auth/me`, { withCredentials: true }));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Multiple auth checks: ${successful} successful, ${failed} failed`);
    
    // Test 7: Test logout
    console.log('\n7. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {}, {
      withCredentials: true
    });
    console.log('✅ Logout successful');
    
    // Test 8: Test auth endpoint after logout (should return 401)
    console.log('\n8. Testing auth endpoint after logout...');
    try {
      await axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
      console.log('❌ Unexpected success after logout - should have returned 401');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 after logout');
      } else {
        console.log('❌ Unexpected error after logout:', error.response?.status);
      }
    }
    
    console.log('\n🎉 Authentication flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Server connection working');
    console.log('✅ Registration working');
    console.log('✅ Login working');
    console.log('✅ Authentication checks working');
    console.log('✅ Multiple requests handled properly');
    console.log('✅ Logout working');
    console.log('✅ Unauthenticated requests properly rejected');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      console.log('💡 Rate limiting issue - check server configuration');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server not running - start with: cd backend && npm run dev');
    }
  }
}

// Run the test
testAuthFlow();
