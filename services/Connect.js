module.exports = class Connect {
  constructor() {
    this.availableDocs = [];
    this.patientQueue = [];
  }

  //when a patient hits attempts to connect
  connectPatient(patient) {
    let availableDoctor = { doc: this.availableDocs.shift(), patient };

    if (!availableDoctor.doc) {
      // display waiting screen for patient
      this.enqueuePatient(patient);
    }
    return availableDoctor.doc;
  }

  //when a doctor connects or a call ends
  addDocToPool(doctor) {
    doctor.roomName = Date.now();

    this.availableDocs.push(doctor);
    let patient = this.patientQueue.shift();
    if (patient) {
      patient.emit("FromAPI", this.connectPatient(patient));
    }
  }

  //when more patients than doctors
  enqueuePatient(patient) {
    this.patientQueue.push(patient);
  }
}









