const config = require('./config');
const { videoToken } = require('./tokens');
const Connect = require('../services/Connect.js')

const path = require('path');
const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const port = 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(express.static(path.resolve(__dirname, '../client/build')));

const server = http.createServer(app);
const io = socketIo(server);
const connect = new Connect();

io.on("connection", (socket) => {
  console.log("New client connected");
  
  socket.on("FromAPI", req  => {
    const identity = `User:${Date.now()}`;
    const room = "TEST";
    const token = videoToken(identity, room, config);
    
    JSON.stringify({
      token: token.toJwt()
    })

    socket.doctor = connect.connectDoctor(socket);
    socket.emit("FromAPI", {token: token.toJwt(), roomName: room, username: identity});
  });

  socket.on("disconnect", () => {
    connect.releaseDoctor(socket.doctor);
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
