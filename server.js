const config = require('./server/config');
const { chatToken, videoToken, voiceToken } = require('./server/tokens');
const Connect = require('./services/Connect.js')

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


const server = http.createServer(app);
const io = socketIo(server);
const connect = new Connect();

io.on("connection", (socket) => {
  console.log("New client connected");
  
  socket.on("FromAPI", req  => {
    console.log(`req.query: ${JSON.stringify(req)}`)
    const identity = req.identity;
    const room = req.room;
    const token = videoToken(identity, room, config);
    JSON.stringify({
      token: token.toJwt()
    })

    socket.emit("FromAPI", {token: token.toJwt(), doctor: connect.connectDoctor(socket)});
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// _____________Begin Twilio Shit_______________________________________________________________________
const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/chat/token', (req, res) => {
  const identity = req.query.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/chat/token', (req, res) => {
  const identity = req.body.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.get('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});
// _____________End Twilio Shit_______________________________________________________________________

server.listen(port, () => console.log(`Listening on port ${port}`));
