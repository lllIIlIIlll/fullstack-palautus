import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increase = (feedback) => {
    feedback == 'good' ? setGood(good + 1) : feedback == 'neutral' ? setNeutral(neutral + 1) : setBad(bad + 1)
  }

  return (
    <div>
      <Header/>
      <Button handleClick={() => increase('good')} text={'good'}/>
      <Button handleClick={() => increase('neutral')} text={'neutral'}/>
      <Button handleClick={() => increase('bad')} text={'bad'}/>
      <h1>statistics</h1>
      {good+neutral+bad > 0 ? (
        <Statistics good={good} neutral={neutral} bad={bad}/>
      ) : (
        <p>no feedback given</p>
      )
      }
    </div>
  )
}

const Header = () => {
  return <h1>give feedback</h1>
}

const Button = ({handleClick, text}) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const average = (good*1)+(bad*-1)
  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={good}/>
        <StatisticsLine text='neutral' value={neutral}/>
        <StatisticsLine text='bad' value={bad}/>
        <StatisticsLine text='all' value={good+neutral+bad}/>
        <StatisticsLine text='average' value={average/(good+neutral+bad)}/>
        <StatisticsLine text='positive' value={String(good/(good+neutral+bad)*100)+'%'}/>
      </tbody>
    </table>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

export default App
