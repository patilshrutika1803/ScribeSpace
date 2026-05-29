const http = require('http');

const payload = {
  email: 'shrutika@gmail.com',
  password: '123456',
};

const data = JSON.stringify(payload);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body || '{}');
      console.log('Response body:', JSON.stringify(parsed, null, 2));
      if (parsed && parsed.token) {
        console.log('\nJWT token:', parsed.token);
      }
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\nLogin succeeded.');
      } else {
        console.error('\nLogin failed.');
      }
    } catch (err) {
      console.log('Raw response body:', body);
      console.error('Failed to parse JSON response:', err.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
