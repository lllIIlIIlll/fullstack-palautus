import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Table, Form, Button } from 'react-bootstrap'

import NotificationContext from './NotificationContext'
import Notification from './components/Notification'
import { BlogCover, Blog } from './components/Blog'
import { Togglable } from './components/Togglable'
import { BlogForm } from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import UserContext from './UserContext'
import { Users } from './components/Users'
import { User } from './components/User'
import { Header } from './components/Header'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [user, userDispatch] = useContext(UserContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog'])

      notificationDispatch({
        type: 'SHOW',
        content: `new blog created: ${variables.title}`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({ type: 'SHOW', content: error.message })
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog'])

      notificationDispatch({
        type: 'SHOW',
        content: `${variables.title} removed!`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({ type: 'SHOW', content: error.message })
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog'])

      notificationDispatch({
        type: 'SHOW',
        content: `you liked: ${variables.title}`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({ type: 'SHOW', content: error.message })
    },
  })

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedIn')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', user })
    }
  }, [userDispatch])

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const createBlogRef = useRef()

  const fetchBlogs = async () => {
    const response = await blogService.getAll()
    return response.sort((a, b) => b.likes - a.likes)
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  })

  if (result.isLoading) {
    return <p>blog service not available due to problems in server</p>
  }

  const blogs = result.data

  const loginForm = () => (
    <div
      className="container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
        <h1>log in to application</h1>
        <Notification />
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            style={{ width: '250px' }}
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <Form.Control
            style={{ width: '250px' }}
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button style={{ marginTop: '10px' }} type="submit">
          login
        </Button>
      </Form>
    </div>
  )

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const likeBlog = (id, title) => {
    likeBlogMutation.mutate({ id, title })
  }

  const deleteBlog = (id, title) => {
    if (window.confirm(`Remove blog "${title}"?`)) {
      removeBlogMutation.mutate({ id, title })
      navigate('/')
    }
  }

  const showBlogs = (blogs) => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={createBlogRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <Table striped>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>
                    <BlogCover blog={blog} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedIn', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'LOGIN', user: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationDispatch({
        type: 'SHOW',
        content: 'wrong credentials',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 3000)
    }
  }

  if (!user) {
    return loginForm()
  }

  return (
    <div className="container">
      <Header />
      <Notification />
      <Routes>
        <Route path="/" element={showBlogs(blogs)} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={
                blogMatch
                  ? blogs.find((blog) => blog.id === blogMatch.params.id)
                  : null
              }
              removeBlog={deleteBlog}
              likeBlog={likeBlog}
            />
          }
        />
        <Route path="/users" element={<Users />} />
        <Route
          path="/users/:id"
          element={<User id={userMatch ? userMatch.params.id : null} />}
        />
      </Routes>
    </div>
  )
}

export default App
