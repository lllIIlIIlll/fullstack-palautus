export const Course = ({ course }) => {
    return (
        <div>
          <Header name={course.name}/>
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
        </div>  
    )
  }
  
const Header = ({ name }) => <h1>{name}</h1>
  
const Content = ({ parts }) => {
    return parts.map(part => <Part key={part.id} part={part}/>)
  }
  
const Total = (props) => {
    const exercises = props.parts.map(x => x.exercises)
    return <p>total of {exercises.reduce((x, acc) => acc += x)} exercises</p>
  }
  
const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>
