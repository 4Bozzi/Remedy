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
    const doctor = connect.connectPatient(socket); 
  });

  socket.on("connectDoctor", req => {
    console.log("New doctor connecting!")
    socket.doctorName = req.doctorName;
    connect.addDocToPool({doctorName: req.doctorName, socket})
  });

  socket.on("disconnect", () => {
    if(socket.doctorName){
      console.log("A doctor disconnected, we need to keep this socket though...")
      connect.addDocToPool({doctorName: socket.doctorName, socket});
    }
    
    console.log("Client disconnected");
  });
});
