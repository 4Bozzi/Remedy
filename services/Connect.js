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
    } else {
      createRoom(doctor, patient);
    }
    // return availableDoctor.doc;
  }

  //when a doctor connects or a call ends
  addDocToPool(doctor) {
    console.log("New doctor available!")
    doctor.roomName = Date.now();
    this.availableDocs.push(doctor);
    let patient = this.patientQueue.shift();
    if (patient) {
      console.log("There is a patient in line, connecting them to a doctor!")
      createRoom(doctor, patient);
      // patient.emit("FromAPI", this.connectPatient(patient));
    }
  }

  //when more patients than doctors
  enqueuePatient(patient) {
    console.log("No doctors available, putting this patient in line.")
    this.patientQueue.push(patient);
  }

  createRoom(doctor, patient) {
    const identity = `User:${Date.now()}`;
    const patientToken = videoToken(identity, doctor.roomName, config);
    const doctorToken = videoToken(doctor.doctorName, doctor.roomName, config);

    patient.emit("connectPatient", { token: patientToken.toJwt(), roomName: doctor.roomName, username: identity });
    doctor.socket.emit("connectDoctor", { token: doctorToken.toJwt(), roomName: doctor.roomName, username: doctor.doctorName });
  }
}









