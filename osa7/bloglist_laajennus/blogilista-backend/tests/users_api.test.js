const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('creating user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testi', passwordHash })
    await user.save()
  })

  test('creation succeeds with valid info', async () => {
    const newUser = {
      username: 'uniikki',
      name: 'Testi Testinen',
      password: 'testi123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with duplicate username', async () => {
    const newUser = {
      username: 'uniikki',
      name: 'Testi Testinen',
      password: 'testi123',
    }

    const duplicateUser = {
      username: 'uniikki',
      name: 'Testi Testinen',
      password: 'testi123',
    }

    await api.post('/api/users').send(newUser).expect(201)

    await api.post('/api/users').send(duplicateUser).expect(400)
  })

  test('creation fails with too short username', async () => {
    const userWithTooShortUsername = {
      username: 'un',
      name: 'Testi Testinen',
      password: 'testi123',
    }

    await api.post('/api/users').send(userWithTooShortUsername).expect(400)
  })

  test('creation fails with too short password', async () => {
    const userWithTooShortPassword = {
      username: 'uniikki',
      name: 'Testi Testinen',
      password: '12',
    }

    await api.post('/api/users').send(userWithTooShortPassword).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
