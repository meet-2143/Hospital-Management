var http = require('http');

const port = process.env.port || 8080 ;

const app = require('./src/app');

const server = http.createServer(app);

server.listen(port, () => {
  console.log("http://localhost:" + port);
});
