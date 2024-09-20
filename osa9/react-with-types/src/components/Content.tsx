import { CoursePart } from "../types";
import { Part } from "./Part";

export const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <>
      {courseParts.map((course: CoursePart) => {
        return <Part key={course.name} course={course} />;
      })}
    </>
  );
};
