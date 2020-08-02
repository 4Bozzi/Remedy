module.exports = class Connect {
  constructor() {
    this.availableDocs = ['Dr. Manhattan', 'Dr. Strange', 'Dr. Octavius'];
    this.patientQueue = [];
  }

  connectDoctor(patient) {
    let availableDoctor = { doc: this.availableDocs.shift(), patient };

    if (availableDoctor.doc) {
      //display video page
      this.releaseDoctor(availableDoctor);
    } else {
      //display loading bar thingy
      this.enqueuePatient(patient);
    }

    return availableDoctor.doc;
  }

  //This currently just acts as a way to mark a call as DONE
  //to kick off everything else that is cool
  //this will be cooler when i make a button to disconnect on the front end
  releaseDoctor(doctor) {
    setTimeout(() => {
      doctor.patient.disconnect(true);
      this.availableDocs.push(doctor.doc);
      let patient = this.patientQueue.shift();
      if (patient) {
        patient.emit("FromAPI", this.connectDoctor(patient));
      }
    }, 20000);
  }

  enqueuePatient(patient) {
    this.patientQueue.push(patient);
  }
}









