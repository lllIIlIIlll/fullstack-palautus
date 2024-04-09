const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Contact = require('./models/contact')

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/info', (req, res) => {
  Contact.find({}).then(contacts => {
    const date = new Date()
    res.send(`Phonebook has info for ${contacts.length} people <br><br>${date}`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
