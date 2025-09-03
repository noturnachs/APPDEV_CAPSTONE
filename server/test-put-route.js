const http = require('http');

// Test data
const testData = JSON.stringify({
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone_number: '123-456-7890',
  company_name: 'Test Company',
  service_type: 'permit_acquisition',
  description: 'Test description',
  status: 'pending'
});

// Test the PUT route
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/quotations/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('Testing PUT route...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Method:', options.method);

const req = http.request(options, (res) => {
  console.log(`\nResponse Status: ${res.statusCode}`);
  console.log('Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    if (res.statusCode === 200) {
      console.log('✅ PUT route is working!');
    } else {
      console.log('❌ PUT route failed with status:', res.statusCode);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

// Send the test data
req.write(testData);
req.end();
