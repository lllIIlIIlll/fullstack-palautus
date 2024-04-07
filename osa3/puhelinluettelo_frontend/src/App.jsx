import { useState, useEffect } from 'react'
import axios from 'axios'
import contactsService from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [searched, setSearched] = useState(persons)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    contactsService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    let filtered = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setSearched(filtered)
    if (event.target.value === '') {
      setSearched([])
    }
  }

  const addContact = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      return alert('Name or number missing')
    }
    let duplicate = false
    persons.forEach(person => {
      if (person.name === newName) {
        duplicate = true
      }
    })
    duplicate ? alert(`${newName} is already added to phonebook`) : setPersons(persons.concat({name: newName, number: newNumber}))
    setPersons(persons.concat({name: newName, number: newNumber, id: persons.length+1}))

    const contactObject = {
      name: newName,
      number: newNumber,
      id: (persons.length+1).toString()
    }
  
    contactsService
      .create(contactObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewNumber('')
        setNotification(
          [`Added ${returnedContact.name}`, 0]
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      })
  }

  const handleDeletion = (id) => {
    if (window.confirm(`Delete ${persons.filter(person => person.id === id)[0].name}?`)) {
      contactsService
      .deleteById(id)
      .then(returnedContact => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <h2>add new</h2>
      <PersonForm 
        addContact={addContact}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        searched={persons.filter(person => searched.length === 0 && newSearch === '' ? persons : searched.includes(person))} 
        handleDelete={handleDeletion}
      />
    </div>
  )

}

const Filter = ({ newSearch, handleSearchChange}) => {
  return (
    <div>
      filter shown with: <input value={newSearch} onChange={handleSearchChange} />
    </div>
  )
}

const PersonForm = ({ addContact, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ searched, handleDelete }) => {
  return searched.map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>)
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success_message">
      {message[0]}
    </div>
  )
}

export default App
