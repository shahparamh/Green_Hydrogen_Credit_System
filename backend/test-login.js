import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Test login with existing user
async function testLogin() {
  try {
    console.log('🧪 Testing login with existing user...');
    
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'producer'
    };

    const response = await axios.post(`${API_BASE}/auth/login`, loginData, {
      withCredentials: true
    });
    
    console.log('✅ Login successful:', response.data.message);
    console.log('👤 User data:', {
      email: response.data.user.email,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      fullName: response.data.user.fullName,
      displayName: response.data.user.displayName
    });
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

// Test registration with new user
async function testRegistration() {
  try {
    console.log('\n🧪 Testing registration with new user...');
    
    const registerData = {
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'buyer',
      organization: 'Test Corp'
    };

    const response = await axios.post(`${API_BASE}/auth/register`, registerData, {
      withCredentials: true
    });
    
    console.log('✅ Registration successful:', response.data.message);
    console.log('👤 User data:', {
      email: response.data.user.email,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      fullName: response.data.user.fullName,
      displayName: response.data.user.displayName
    });
    
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting authentication tests...\n');
  
  await testLogin();
  await testRegistration();
  
  console.log('\n🎉 Tests completed!');
}

runTests();
