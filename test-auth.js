import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test authentication flow
async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: Test registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'producer',
      organization: 'Test Corp'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData, {
      withCredentials: true
    });
    console.log('✅ Registration successful:', registerResponse.data.message);

    // Test 3: Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'producer'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData, {
      withCredentials: true
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test 4: Test get current user
    console.log('\n4. Testing get current user...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      withCredentials: true
    });
    console.log('✅ Get current user successful:', userResponse.data.user.email);

    // Test 5: Test logout
    console.log('\n5. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {}, {
      withCredentials: true
    });
    console.log('✅ Logout successful');

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 This might be a cookie/authentication issue');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 4000');
    }
  }
}

// Run the test
testAuth();

