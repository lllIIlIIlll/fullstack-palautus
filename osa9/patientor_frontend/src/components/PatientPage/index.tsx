import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Diagnosis, Patient } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import { NewPatientEntryForm } from "./NewPatientEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const id = useParams().id as string;

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };
    fetchPatient();
  }, [id]);

  const updatedPatient = (update: Patient) => {
    setPatient(update);
  };

  if (patient)
    return (
      <div>
        <h1>
          {patient.name}, {patient.gender}
        </h1>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <br />
        <NewPatientEntryForm
          updatedPatient={updatedPatient}
          patient={patient}
        />
        <br />
        <h2 style={{ marginTop: "40px" }}>entries</h2>
        {patient.entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: "2px solid black",
              borderRadius: "5px",
              margin: "5px",
              padding: "5px",
            }}
          >
            <EntryDetails entry={entry} />
            <p>{entry.description}</p>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => {
                  const diagnosis = diagnoses.find((d) => d.code === code);
                  return (
                    <li key={code}>
                      {code} {diagnosis ? diagnosis.name : null}
                    </li>
                  );
                })}
              </ul>
            )}
            <p>diagnose by {entry.specialist}</p>
          </div>
        ))}
      </div>
    );
  return null;
};

export default PatientPage;
