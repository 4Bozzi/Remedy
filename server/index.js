const config = require('./config');
const { videoToken } = require('./tokens');
const Connect = require('../services/Connect.js')

const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3001;
const SERVER_PORT = 3001;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${
      worker.process.pid
      } exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(pino);
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  const server = http.createServer(app);
  const io = socketIo(server);
  const connect = new Connect();

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("FromAPI", req => {
      const identity = `User:${Date.now()}`;
      const room = "TEST";
      const token = videoToken(identity, room, config);

      JSON.stringify({
        token: token.toJwt()
      })

      socket.doctor = connect.connectDoctor(socket);
      socket.emit("FromAPI", { token: token.toJwt(), roomName: room, username: identity });
    });

    socket.on("disconnect", () => {
      connect.releaseDoctor(socket.doctor);
      console.log("Client disconnected");
    });
  });
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  server.listen(SERVER_PORT, () => console.log(`Socket server listening on port ${SERVER_PORT}`));
}