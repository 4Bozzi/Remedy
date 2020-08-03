const config = require('./config');
const { videoToken } = require('./tokens');
const Connect = require('../services/Connect.js')

const express = require('express');
const http = require("http");
//const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path');

const PORT = process.env.PORT || 3001;


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(pino);
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../react-ui/build", "index.html"));
// });





const server = http.createServer(app.listen(PORT));
//const io = socketIo(server);
const io = require('socket.io').listen(server);
io.origins('*:*')
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

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
//server.listen(PORT, () => console.log(`Socket server listening on port ${PORT}`));