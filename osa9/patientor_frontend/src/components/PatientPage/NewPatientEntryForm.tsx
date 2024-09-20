import { SyntheticEvent, useState } from "react";
import {
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import axios from "axios";

import patientService from "../../services/patients";
import { Type, HealthCheckRating, Patient } from "../../types";

interface Props {
  patient: Patient;
  updatedPatient: (value: Patient) => void;
}

export const NewPatientEntryForm = ({ updatedPatient, patient }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [type, setType] = useState<string>("Hospital");
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");

  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);

  const [employerName, setEmployerName] = useState<string>("");
  const [sickStart, setSickStart] = useState("");
  const [sickEnd, setSickEnd] = useState("");

  const [error, setError] = useState<string>();

  const types = ["Hospital", "HealthCheck", "OccupationalHealthCare"];
  const diagnosis = [
    "M24.2",
    "M51.2",
    "S03.5",
    "J10.1",
    "J06.9",
    "Z57.1",
    "N30.0",
    "H54.7",
    "J03.0",
    "L60.1",
    "Z74.3",
    "L20",
    "F43.2",
    "S62.5",
    "H35.29",
  ];

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const submitDiagnosis = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      let patientUpdate;
      switch (type) {
        case "HealthCheck":
          patientUpdate = await patientService.addDiagnosis(patient.id, {
            description: description,
            type: Type.HealthCheck,
            date: date,
            specialist: specialist,
            healthCheckRating: healthCheckRating,
            diagnosisCodes: diagnosisCodes,
          });
          onCancel();
          return updatedPatient(patientUpdate);
        case "Hospital":
          patientUpdate = await patientService.addDiagnosis(patient.id, {
            description: description,
            type: Type.Hospital,
            date: date,
            specialist: specialist,
            diagnosisCodes: diagnosisCodes,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria,
            },
          });
          onCancel();
          return updatedPatient(patientUpdate);

        default:
          let sickLeave;
          if (sickStart && sickEnd) {
            sickLeave = {
              startDate: sickStart,
              endDate: sickEnd,
            };
          }
          patientUpdate = await patientService.addDiagnosis(patient.id, {
            description: description,
            type: Type.OccupationalHealthCare,
            date: date,
            specialist: specialist,
            diagnosisCodes: diagnosisCodes,
            employerName: employerName,
            sickLeave: sickLeave,
          });
          onCancel();
          return updatedPatient(patientUpdate);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data.error) {
          const errorResponse = e?.response?.data.error;
          if (Array.isArray(errorResponse)) {
            setError(errorResponse[0].message);
          } else {
            setError(errorResponse);
          }
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  const onCancel = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickStart("");
    setSickEnd("");
    setError("");
    setType("Hospital");
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submitDiagnosis}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h3 style={{ margin: "20px" }}>Select entry type:</h3>
          <Select value={type} onChange={handleTypeChange}>
            {types.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </div>
        <InputLabel id="description">Description</InputLabel>
        <TextField
          id="description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputLabel id="entry-date">Entry date</InputLabel>
        <TextField
          id="entry-date"
          type="date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <InputLabel id="specialist">Specialist</InputLabel>
        <TextField
          id="specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel id="diagnosis-codes">Select diagnosis codes</InputLabel>
        <Select
          id="diagnosis-codes"
          fullWidth
          multiple
          value={diagnosisCodes}
          onChange={handleDiagnosisChange}
        >
          {diagnosis.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
        {type === "Hospital" && (
          <>
            <InputLabel id="discharge-date">Discharge date</InputLabel>
            <TextField
              id="discharge-date"
              type="date"
              placeholder="YYYY-MM-DD"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <InputLabel id="discharge-criteria">Discharge criteria</InputLabel>
            <TextField
              required
              id="discharge-criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}
        {type === "HealthCheck" && (
          <>
            <InputLabel id="health-check-rating">
              Select health check rating 0-3
            </InputLabel>
            <TextField
              id="health-check-rating"
              fullWidth
              type="number"
              value={healthCheckRating}
              inputProps={{ min: 0, max: 3 }}
              onChange={({ target }) =>
                setHealthCheckRating(Number(target.value) as HealthCheckRating)
              }
            />
          </>
        )}
        {type === "OccupationalHealthCare" && (
          <>
            <InputLabel id="employer-name">Employer name</InputLabel>
            <TextField
              id="employer-name"
              required
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <InputLabel id="sick-leave-start">Sick leave start</InputLabel>
            <TextField
              id="sick-leave-start"
              type="date"
              value={sickStart}
              onChange={({ target }) => setSickStart(target.value)}
            />
            <InputLabel id="sick-leave-end">Sick leave end</InputLabel>
            <TextField
              id="sick-leave-end"
              type="date"
              value={sickEnd}
              onChange={({ target }) => setSickEnd(target.value)}
            />
          </>
        )}
        <br />
        <Button
          color="secondary"
          variant="contained"
          style={{ float: "left", margin: "20px" }}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          style={{
            float: "right",
            margin: "20px",
          }}
          type="submit"
          variant="contained"
        >
          Add
        </Button>
      </form>
    </div>
  );
};
