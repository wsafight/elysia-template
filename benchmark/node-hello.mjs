import http from 'node:http';

const server = http.createServer((req, res) => {
  res.write('hello world!');
  res.end();
});
server.listen(3000);
