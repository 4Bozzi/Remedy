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

  socket.on("connectPatient", req => {
    console.log("Attempt to connect patient to a doctor");
    let doctor = connect.connectPatient(socket); 

    //check if doctor and connect
    if(doctor){
      const identity = `User:${Date.now()}`;
      const patientToken = videoToken(identity, doctor.roomName, config);
      const doctorToken = videoToken(doctor.doctorName, doctor.roomName, config);
  
      socket.emit("connectPatient", { token: patientToken.toJwt(), roomName: doctor.roomName, username: identity });
      doctor.socket.emit("connectDoctor", { token: doctorToken.toJwt(), roomName: doctor.roomName, username: doctor.doctorName });
    }
  });

  socket.on("connectDoctor", req => {
    console.log("New doctor connecting!")
    socket.doctorName = req.doctorName;
    let result = connect.addDocToPool({doctorName: req.doctorName, socket})

    //check if patient and connect
    if(result.patient){
      const identity = `User:${Date.now()}`;
      // const roomName;
      // const doctorName;
      const patientToken = videoToken(identity, result.doctor.roomName, config);
      const doctorToken = videoToken(result.doctor.doctorName, result.doctor.roomName, config);
  
      result.patient.emit("connectPatient", { token: patientToken.toJwt(), roomName: result.doctor.roomName, username: identity });
      socket.emit("connectDoctor", { token: doctorToken.toJwt(), roomName: result.doctor.roomName, username: result.doctor.doctorName });
    }
  });

  socket.on("disconnect", () => {
    if(socket.doctorName){
      console.log("A doctor disconnected, we need to keep this socket though...")
      connect.addDocToPool({doctorName: socket.doctorName, socket});
    }
    
    console.log("Client disconnected");
  });
});
