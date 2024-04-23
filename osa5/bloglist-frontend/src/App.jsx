import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import { Togglable } from './components/Togglable'
import { BlogForm } from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const createBlogRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [blogs])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedIn')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <Notification message={message} />
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const likeBlog = (id) => {
    blogService.like(id)
  }

  const deleteBlog = (id, title) => {
    if (window.confirm(`Remove blog "${title}"?`)) {
      blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setMessage(`blog ${title} deleted!`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  const showBlogs = (blogs) => {
    return (
      <div>
        <h1>blogs</h1>
        <p>{`${user.name} logged in`} <button onClick={() => handleLogout()}>logout</button></p>
        <Togglable buttonLabel='new blog' ref={createBlogRef} >
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <Notification message={message} />
        <div className='blogs'>
          {blogs.map(blog =>
            <Blog key={blog.id} user={user} blog={blog} likeBlog={likeBlog} removeBlog={deleteBlog}/>)}
        </div>
      </div>

    )
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        createBlogRef.current.toggleVisibility()
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${returnedBlog.title} added!`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(err => {
        setMessage('make sure entry includes title and author')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedIn', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedIn')
    setUser(null)
  }

  return (
    <div>
      {!user && loginForm()}
      {user && showBlogs(blogs)}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else {
    return (
      <>
        <p style={{ 'background': 'lightgrey', 'fontSize': '20px', 'border': '2px solid grey', 'padding': '15px' }}>{message}</p>
      </>
    )
  }
}

export default App