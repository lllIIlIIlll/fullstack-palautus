import { isNotNumber } from "./utils/notNumber";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  exerciseHours: number[],
  target: number
): Result => {
  const days = exerciseHours.length;
  const trainingDays = exerciseHours.filter((x) => x != 0).length;
  const averageTime =
    exerciseHours.reduce((p, a) => p + a, 0) / exerciseHours.length;
  console.log(averageTime - target);
  const rating =
    averageTime - target < 0 ? 1 : averageTime - target === 0 ? 2 : 3;
  let ratingDescription = "";
  if (rating === 2) ratingDescription = "target met";
  else if (rating === 1) ratingDescription = "target not met";
  else ratingDescription = "target surpassed";

  return {
    periodLength: days,
    trainingDays: trainingDays,
    success: rating >= 2 ? true : false,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: averageTime,
  };
};

const parseArguments = (args: string[]) => {
  if (args.length < 4) throw new Error("Not enough arguments");
  const exerciseHoursList = args.slice(3).map((x) => Number(x));
  if (!isNotNumber(args[2]) && !exerciseHoursList.some((x) => isNotNumber(x))) {
    return {
      target: Number(args[2]),
      exerciseHoursList: exerciseHoursList,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  const { exerciseHoursList, target } = parseArguments(process.argv);
  console.log(calculateExercises(exerciseHoursList, target));
} catch (error: unknown) {
  let errorMessage = "";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
