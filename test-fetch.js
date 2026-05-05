const http = require('http');

http.get('http://localhost:3000/enkihaa', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
    console.log(matches);
  });
});
