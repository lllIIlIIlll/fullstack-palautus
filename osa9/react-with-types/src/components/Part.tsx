import { CoursePart } from "../types";

export const Part = ({ course }: { course: CoursePart }) => {
  switch (course.kind) {
    case "basic":
      return (
        <>
          <h2>
            {course.name} {course.exerciseCount}
          </h2>
          <p>{course.description}</p>
        </>
      );
    case "group":
      return (
        <>
          <h2>
            {course.name} {course.exerciseCount}
          </h2>
          <p>project exercises {course.groupProjectCount}</p>
        </>
      );
    case "background":
      return (
        <>
          <h2>
            {course.name} {course.exerciseCount}
          </h2>
          <p>{course.description}</p>
          <p>{course.backgroundMaterial}</p>
        </>
      );
    case "special":
      return (
        <>
          <h2>
            {course.name} {course.exerciseCount}
          </h2>
          <p>{course.description}</p>
          <p>required skills: {course.requirements.join(", ")}</p>
        </>
      );
  }
};
