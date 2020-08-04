const config = require('./config');
const { videoToken } = require('./tokens');
const Connect = require('../services/Connect.js')
const connect = new Connect();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const http = require( "http" ).createServer( app );
const io = require( "socket.io" )( http );
http.listen(PORT);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

io.origins('*:*')

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("FromAPI", req => {
    let doctor = connect.connectPatient(socket);
    const identity = `User:${Date.now()}`;
    // const room = "TEST";
    const patientToken = videoToken(identity, doctor.roomName, config);
    const doctorToken = videoToken(doctor.doctorName, doctor.roomName, config);

    JSON.stringify({
      token: patientToken.toJwt()
    })

    JSON.stringify({
      token: doctorToken.toJwt()
    })

    socket.emit("FromAPI", { token: patientToken.toJwt(), roomName: doctor.roomName, username: identity });
    doctor.socket.emit("connectDoctor", { token: doctorToken.toJwt(), roomName: doctor.roomName, username: doctor.doctorName });
  });

  socket.on("connectDoctor", req => {
    connect.addDocToPool({doctorName: req.doctorName, socket})
  });

  socket.on("disconnect", () => {
    connect.releaseDoctor(socket.doctor);
    console.log("Client disconnected");
  });
});
