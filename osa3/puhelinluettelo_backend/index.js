const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      },
    ]

app.get('/', (req, res) => {
    res.send('index')
})

app.get('/info', (req, res) => {
    const date = new Date
    res.send(`Phonebook has info for ${persons.length} people <br><br>${date}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.filter(person => person.id === id)[0]
    console.log(person)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
        error: 'name/number missing' 
    })
  } else if (persons.filter(person => person.name === body.name).length > 0) {
    return res.status(400).json({ 
        error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 10000) + 1)
  }
  persons = persons.concat(person)
  res.json(person)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})