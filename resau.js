const http = require('http');
const script = require('./script.js');


const server = http.createServer(script);
  



const PORT = 3002;
server.listen(PORT, 'localhost', () => {
    console.log(" - Le serveur est activé au port :", PORT);
});