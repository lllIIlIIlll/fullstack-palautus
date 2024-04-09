const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://arttu:${password}@koulu.uhzvlxe.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=koulu`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv[3] === undefined) {
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
  })
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
    id: String(Math.floor(Math.random() * 10000) + 1)
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
