const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index")

const port = 3001;
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);

let availableDocs = ['Dr. Manhattan','Dr. Strange','Dr. Octavius'];
let patientQueue = [];

io.on("connection", (socket) => {
  console.log("New client connected");
  getApiAndEmit(socket);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = socket => {
  socket.emit("FromAPI", connectDoctor(socket));
};

function connectDoctor(socket){
  let availableDoctor = {doc: availableDocs.shift(), socket};
  if(availableDoctor.doc){
    //display video page
    console.log(availableDoctor.doc);
    releaseDoctor(availableDoctor);
  } else {
    //display loading bar thingy
    enqueuePatient(socket);
  }
    
  return availableDoctor.doc;
}

//This currently just acts as a way to mark a call as DONE
//to kick off everything else that is cool
//this will be cooler when i make a button to disconnect on the front end
function releaseDoctor(doctor){
  setTimeout(()=>{
    doctor.socket.disconnect(true);
    availableDocs.push(doctor.doc);
    let patient = patientQueue.shift();
    if(patient){
      patient.emit("FromAPI", connectDoctor(patient));
    }
  }, 20000);
}

function enqueuePatient(patient){
  patientQueue.push(patient);
}


server.listen(port, () => console.log(`Listening on port ${port}`));
