import { z } from "zod";
import {
  Gender,
  NewBaseEntry,
  NewEntry,
  NewPatient,
  Discharge,
  EntryType,
  SickLeave,
  HealthCheckRating,
  Entry,
} from "./types";

export const newPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export const toNewPatientEntry = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing string");
  }
  return text;
};

const newBaseEntrySchema = z.object({
  date: z.string().date(),
  type: z.nativeEnum(EntryType),
  specialist: z.string(),
  description: z.string(),
  diagnosisCodes: z.string().array().optional(),
});

const dischargeSchema = z.object({
  date: z.string().date(),
  criteria: z.string(),
});

const sickLeaveSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

const parseDischarge = (object: unknown): Discharge => {
  if (!object) {
    throw new Error("Missing or incorrect discharge information");
  }
  return dischargeSchema.parse(object);
};

const parseSickLeave = (object: unknown): SickLeave => {
  return sickLeaveSchema.parse(object);
};

const parseHealthCheckRating = (value: number) => {
  if (!Object.values(HealthCheckRating).includes(value)) {
    throw new Error("Incorrect health check rating");
  }

  return value;
};

const toNewBaseEntry = (object: unknown): NewBaseEntry => {
  return newBaseEntrySchema.parse(object);
};

export const toNewDiagnosisEntry = (object: Entry): NewEntry | undefined => {
  const newBaseEntry = toNewBaseEntry(object);

  switch (object.type) {
    case EntryType.Hospital: {
      return {
        ...newBaseEntry,
        type: EntryType.Hospital,
        discharge: parseDischarge(object.discharge),
      };
    }
    case EntryType.OccupationalHealthcare: {
      return {
        ...newBaseEntry,
        type: EntryType.OccupationalHealthcare,
        employerName: parseString(object.employerName),
        sickLeave: object.sickLeave
          ? parseSickLeave(object.sickLeave)
          : undefined,
      };
    }
    case EntryType.HealthCheck: {
      return {
        ...newBaseEntry,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    }
    default:
      return undefined;
  }
};

export default toNewPatientEntry;
