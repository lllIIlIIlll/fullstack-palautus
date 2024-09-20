import { Entry } from "../../types";
import {
  HealthCheckEntryInfo,
  HospitalEntryInfo,
  OccupationalEntryInfo,
} from "./Entries";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryInfo entry={entry} />;
    case "OccupationalHealthCare":
      return <OccupationalEntryInfo entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryInfo entry={entry} />;
  }
};

export default EntryDetails;
