const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://arttu:${password}@koulu.uhzvlxe.mongodb.net/testBlogilista?retryWrites=true&w=majority&appName=koulu`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'testauksen harjoittelua 2',
  author: 'minä',
  url: 'merkkijono',
  likes: 14
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})

/*
Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})
*/