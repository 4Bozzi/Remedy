module.exports = class Connect {
  constructor() {
    this.availableDocs = [];
    this.patientQueue = [];
  }

  //when a patient hits attempts to connect
  connectPatient(patient) {
    let doctor = this.availableDocs.shift();
    console.log("New patient connected!")
    if (!doctor) {
      // display waiting screen for patient
      this.enqueuePatient(patient);
    }
    return doctor;
  }

  //when a doctor connects or a call ends
  addDocToPool(doctor) {
    console.log("New doctor available!")
    doctor.roomName = Date.now();
    this.availableDocs.push(doctor);
    let patient = this.patientQueue.shift();
    if(patient){
      console.log("There is a patient in line, connecting them to a doctor!")
      this.availableDocs.shift();
    }
    return {patient, doctor};
  }

  //when more patients than doctors
  enqueuePatient(patient) {
    console.log("No doctors available, putting this patient in line.")
    this.patientQueue.push(patient);
  }
}
