import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
import { isNotNumber } from "./utils/notNumber";
const app = express();

app.use(express.json());

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (isNotNumber(height) || isNotNumber(weight)) {
    return res.send({
      error: "malformatted parameters",
    });
  } else {
    const result = calculateBmi(Number(height), Number(weight));
    return res.send({
      weight: weight,
      height: height,
      bmi: result,
    });
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  console.log(daily_exercises, target);

  if (!target || !Array.isArray(daily_exercises)) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (isNotNumber(target) || daily_exercises.some((x) => isNotNumber(x))) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const result = calculateExercises(
    daily_exercises as number[],
    Number(target)
  );
  return res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
