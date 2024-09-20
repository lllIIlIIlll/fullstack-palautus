import express from "express";
import { z } from "zod";
import { Response } from "express";
import patientService from "../services/patientService";
import { Entry, NonSensitivePatient, Patient } from "../types";
import { toNewPatientEntry, toNewDiagnosisEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getAllPatients());
});

router.get("/:id", (req, res: Response<Patient>) => {
  res.send(patientService.getPatient(req.params.id));
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: "unknown error" });
    }
  }
});

router.post("/:id/entries", (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) {
    try {
      const newDiagnosisEntry = toNewDiagnosisEntry(req.body as Entry);
      if (newDiagnosisEntry) {
        const result = patientService.addDiagnosisEntry(
          patient,
          newDiagnosisEntry
        );
        res.json(result);
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
      } else if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "something went wrong" });
      }
    }
  }
});

export default router;
