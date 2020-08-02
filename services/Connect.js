module.exports = class Connect {
  constructor() {
    this.availableDocs = ['Dr. Manhattan', 'Dr. Strange', 'Dr. Octavius'];
    this.patientQueue = [];
  }

  connectDoctor(patient) {
    let availableDoctor = { doc: this.availableDocs.shift(), patient };

    if (!availableDoctor.doc) {
      // display waiting screen 
      this.enqueuePatient(patient);
    }

    return availableDoctor.doc;
  }

  // this get calls when the disconnect button is pressed
  releaseDoctor(doctor) {
    this.availableDocs.push(doctor);
    let patient = this.patientQueue.shift();
    if (patient) {
      patient.emit("FromAPI", this.connectDoctor(patient));
    }
  }

  enqueuePatient(patient) {
    this.patientQueue.push(patient);
  }
}









