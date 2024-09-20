import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HeartBrokenRoundedIcon from "@mui/icons-material/HeartBrokenRounded";

import {
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";

export const HospitalEntryInfo = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <p>
        {entry.date} <LocalHospitalRoundedIcon />
      </p>
      <p>
        discharge: {entry.discharge.criteria}, {entry.discharge.date}
      </p>
    </div>
  );
};

export const OccupationalEntryInfo = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div>
      <p>
        {entry.date} <WorkRoundedIcon /> {entry.employerName}
      </p>
      {entry.sickLeave ? (
        <p>
          sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
        </p>
      ) : null}
    </div>
  );
};

export const HealthCheckEntryInfo = ({
  entry,
}: {
  entry: HealthCheckEntry;
}) => {
  return (
    <div>
      <p>
        {entry.date} <MedicalServicesRoundedIcon />
      </p>
      <p>
        {entry.healthCheckRating === 0 ? (
          <FavoriteRoundedIcon style={{ color: "green" }} />
        ) : entry.healthCheckRating === 1 ? (
          <FavoriteRoundedIcon style={{ color: "yellow" }} />
        ) : entry.healthCheckRating === 2 ? (
          <FavoriteRoundedIcon style={{ color: "red" }} />
        ) : (
          <HeartBrokenRoundedIcon />
        )}
      </p>
    </div>
  );
};
