module.exports = class Connect {
  constructor() {
    this.availableDocs = [];
    this.patientQueue = [];
  }

  connectPatient(patient) {
    let availableDoctor = { doc: this.availableDocs.shift(), patient };

    if (!availableDoctor.doc) {
      // display waiting screen 
      this.enqueuePatient(patient);
    }

    return availableDoctor.doc;
  }

  // this gets called when the disconnect button is pressed
  releaseDoctor(doctor) {
    this.availableDocs.push(doctor);
    let patient = this.patientQueue.shift();
    if (patient) {
      patient.emit("FromAPI", this.connectPatient(patient));
    }
  }

  enqueuePatient(patient) {
    this.patientQueue.push(patient);
  }

  addDocToPool(doctor){
    doctor.roomName = Date.now();
    //token?
    this.availableDocs.push(doctor);
  }
}









