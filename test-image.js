const https = require('https');

https.get('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', (res) => {
  console.log('Status Code:', res.statusCode);
});
