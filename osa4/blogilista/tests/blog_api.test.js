const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'otsikko',
    author: 'minä',
    url: 'string',
    likes: 4
  },
  {
    title: 'otsikko',
    author: 'minä',
    url: 'string',
    likes: 4
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('get /api/blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })
  
  
  test('blog object has "id" field', async () => {
    const response = await api.get('/api/blogs')
    assert.ok('id' in response.body[0])
  })

})

describe('post /api/blogs', () => {

  test('blog post can be added', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'test',
      url: 'none',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  })
  
  
  test('likes default 0 if undefined', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'test',
      url: 'none',
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 0)
  })
  
  test('posting blog with no title or author returns 400', async () => {
    const newBlog = {
      title: '',
      author: 'test',
      url: 'none',
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

})

describe('deleting blog', () => {

  test('deleting blog', async () => {
    const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogToDelete = blogs.body[1].id
    await api
    .delete(`/api/blogs/${blogToDelete}`)

    const blogsAfterDeletion = await api
    .get('/api/blogs')

    assert.strictEqual(blogs.body.length, blogsAfterDeletion.body.length + 1)
  })

  test('deleting malformatted id returns 400', async () => {
    await api
    .delete(`/api/blogs/66181e853c7ded92630253b`)
    .expect(400)
  })

})


after(async () => {
  await mongoose.connection.close()
})