const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const info = require('./utils/logger')
const config = require('./utils/config')
const error_handler = require('./utils/error_handler')
const getToken = require('./utils/tokenExtractor')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI).then((res) => info('mongodb connected'))

app.use(cors())
app.use(express.json())
app.use(getToken.getToken)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(error_handler.errorHandler)
module.exports = app
