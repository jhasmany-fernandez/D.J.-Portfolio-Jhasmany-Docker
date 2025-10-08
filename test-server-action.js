const http = require('http');

// Test the server action by calling it directly
const testServerAction = async () => {
  console.log('🧪 Testing server action newsletter subscription...');

  const postData = JSON.stringify({
    email: 'jhasmany.fernandez.dev@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    source: 'test-script'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/newsletter/subscribe',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`📧 Response status: ${res.statusCode}`);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📧 Response data:', response);
          resolve(response);
        } catch (err) {
          console.error('❌ Failed to parse response:', data);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request error:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

// Run the test
testServerAction()
  .then(response => {
    console.log('✅ Test completed successfully');
    console.log('📊 Result:', response);
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
  });