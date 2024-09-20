import { isNotNumber } from "./utils/notNumber";

interface Values {
  height: number;
  weight: number;
}

export const calculateBmi = (height: number, weight: number): string => {
  const result = weight / (height / 100) ** 2;
  if (result <= 18.4) return "Underweight";
  else if (result >= 18.5 && result <= 24.9) return "Normal";
  else if (result >= 25 && result <= 39.9) return "Overweight";
  else return "Obese";
};

const parseBmiArguments = (args: string[]): Values => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");
  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
// eslint-disable-next-line
require.main === module;
