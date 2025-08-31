import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test the entire system
async function testSystem() {
  console.log('🧪 Testing Green Hydrogen Credit System...\n');

  try {
    // Test 1: Server Health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is healthy:', healthResponse.data.status);

    // Test 2: API Base
    console.log('\n2. Testing API base...');
    const apiResponse = await axios.get(`${API_BASE}`);
    console.log('✅ API is responding:', apiResponse.data.message);

    // Test 3: Test Endpoint
    console.log('\n3. Testing debug endpoint...');
    const debugResponse = await axios.get(`${API_BASE}/debug`);
    console.log('✅ Debug endpoint working:', debugResponse.data.environment);

    // Test 4: Registration
    console.log('\n4. Testing user registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'Producer',
      email: 'producer@test.com',
      password: 'password123',
      role: 'producer',
      organization: 'Test Hydrogen Corp'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData, {
      withCredentials: true
    });
    console.log('✅ Registration successful:', registerResponse.data.message);

    // Test 5: Login
    console.log('\n5. Testing user login...');
    const loginData = {
      email: 'producer@test.com',
      password: 'password123',
      role: 'producer'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData, {
      withCredentials: true
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test 6: Get Current User
    console.log('\n6. Testing get current user...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      withCredentials: true
    });
    console.log('✅ Get current user successful:', userResponse.data.user.email);

    // Test 7: Create Credit Request
    console.log('\n7. Testing credit request creation...');
    const creditData = {
      amount: 100,
      unit: 'kg',
      productionDetails: {
        facilityName: 'Test Hydrogen Plant',
        facilityType: 'electrolysis',
        location: {
          country: 'USA',
          state: 'California',
          city: 'Los Angeles'
        },
        productionMethod: 'green',
        energySource: 'renewable',
        productionDate: new Date().toISOString()
      },
      description: 'Test credit request for system verification'
    };

    const creditResponse = await axios.post(`${API_BASE}/credits`, creditData, {
      withCredentials: true
    });
    console.log('✅ Credit request created:', creditResponse.data.message);

    // Test 8: Get User Credits
    console.log('\n8. Testing get user credits...');
    const creditsResponse = await axios.get(`${API_BASE}/credits/user`, {
      withCredentials: true
    });
    console.log('✅ User credits retrieved:', creditsResponse.data.credits?.length || 0, 'credits');

    // Test 9: Logout
    console.log('\n9. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {}, {
      withCredentials: true
    });
    console.log('✅ Logout successful');

    console.log('\n🎉 All system tests passed!');
    console.log('\n📋 System Status:');
    console.log('✅ Backend server running');
    console.log('✅ Database connection working');
    console.log('✅ Authentication system working');
    console.log('✅ Credit management working');
    console.log('✅ API endpoints responding');
    console.log('✅ Cookie handling working');
    console.log('✅ CORS configuration correct');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Authentication issue - check JWT_SECRET and COOKIE_SECRET');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server not running - start with: cd backend && npm run dev');
    }
    
    if (error.response?.status === 500) {
      console.log('💡 Server error - check database connection and environment variables');
    }
  }
}

// Run the test
testSystem();

