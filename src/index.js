const qbLog = require('qb-log');
const controllers = require('./controllers');
const setup = require('./setup');
const port = 9090;

const app = setup(controllers);
const http = require('http').Server(app);

const io = require('socket.io')(http);

io.on('connection', (socket) => {
  qbLog.info('User connected');

  socket.broadcast.emit('hi');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('chat message', (msg) => {
    console.log(`message: ${msg}`);
  });

  socket.on('disconnect', () => {
    qbLog.info('user disconnected');
  });
});

http.listen(port, () => qbLog.info(`Listening on PORT ${port}`));
