const express = require("express");
const router = express.Router();


let doctors = ['a','b','c'];

router.get('/doctor', (req, res) => {
  response = connectDoctor();
  res.send({response});
});

function connectDoctor(){
  let busyDoctor = '';
  if(doctors.length){
    //display video page
    busyDoctor = doctors.pop();
    releaseDoctor(busyDoctor);
  } else {
    busyDoctor = "There are currently no available doctors, womp womp";
  }
  return busyDoctor;
}

function releaseDoctor(doctor){
  setTimeout(()=>{
    doctors.push(doctor)
  }, 10000);
}

module.exports = router;