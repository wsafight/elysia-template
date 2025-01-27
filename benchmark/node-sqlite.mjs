
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync('sqlite.db');;

import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/api/user/users') {
    const query = database.prepare('SELECT * FROM users');
    res.write(JSON.stringify(query.all()));
  }
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(3000);
