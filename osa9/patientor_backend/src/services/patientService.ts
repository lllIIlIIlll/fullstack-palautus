import { v1 as uuid } from "uuid";
import patients from "../../data/patientsfull";

import { Patient, NonSensitivePatient, NewPatient, NewEntry } from "../types";

const getAllPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (patient_id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === patient_id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: [],
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addDiagnosisEntry = (patient: Patient, entry: NewEntry) => {
  const updatedPatient = {
    ...patient,
    entries: patient.entries.concat({ ...entry, id: uuid() }),
  };

  const idx = patients.indexOf(patient);
  patients[idx] = updatedPatient;
  return updatedPatient;
};

export default {
  getAllPatients,
  getPatient,
  addPatient,
  addDiagnosisEntry,
};
