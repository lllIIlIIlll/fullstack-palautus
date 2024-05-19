const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const initialValue = 0
  const total = blogs.reduce((total, blog) => total + blog.likes, initialValue)
  return total
}

const favoriteBlog = (blogs) => {
  let result = { title: '', author: '', likes: 0 }
  blogs.forEach((blog) => (blog.likes >= result.likes ? (result = blog) : null))
  return result
}

const authorWithMostBlogs = (blogs) => {
  let result = { author: '', blogs: 0 }
  const authors = []
  blogs.forEach((blog) => {
    if (!authors.includes(blog.author)) {
      authors.push(blog.author)
    }
  })

  authors.forEach((author) => {
    const count = blogs.filter((blog) => blog.author === author).length
    if (count > result.blogs) {
      result = { author: author, blogs: count }
    }
  })
  return result
}

const authorWithMostLikes = (blogs) => {
  let result = { author: '', likes: 0 }
  const authors = []
  blogs.forEach((blog) => {
    if (!authors.includes(blog.author)) {
      authors.push(blog.author)
    }
  })

  const initialValue = 0
  authors.forEach((author) => {
    const likes = blogs
      .filter((blog) => blog.author === author)
      .reduce((total, blog) => total + blog.likes, initialValue)
    if (likes > result.likes) {
      result = { author: author, likes: likes }
    }
  })
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  authorWithMostLikes,
}
