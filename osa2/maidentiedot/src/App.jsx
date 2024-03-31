import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [displayCountries, setDisplayCountries] = useState([])
  const [newCountry, setNewCountry] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const handleSearch = (event) => {
    setNewCountry(event.target.value)
    setDisplayCountries(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value)))
  }

  const handleShowCountry = (name) => {
    console.log(name)
    setDisplayCountries(countries.filter(country => country.name.common.toLowerCase().includes(name.toLowerCase())))
  }

  console.log(countries)
  console.log(newCountry)
  return (
    <div>
      <p>find countries</p>
      <input value={newCountry} onChange={handleSearch}/>
      {displayCountries.length === 1 ? (
          <Country 
            name={displayCountries[0].name.common}
            capital={displayCountries[0].capital}
            area={displayCountries[0].area}
            languages={displayCountries[0].languages}
            flag={displayCountries[0].flag}
          />
        ) : (
          displayCountries.length < 11 ? (
            displayCountries.map(country => <p>{country.name.common}<button onClick={() => handleShowCountry(country.name.common)}>show</button></p>)
          ) : (
            null
          )
        )}
    </div>
  )
}

const Country = ({ name, capital, area, languages, flag }) => {
  console.log(languages)
  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>
      <p>languages:</p>
      <ul>
      {Object.values(languages).map(value => <p>{value}</p>)}
      </ul>
      <h1>{flag}</h1>
    </div>
  )
}

export default App
