import { useState, useEffect } from 'react'
import userService from '../services/users'

export const User = ({ id }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    userService.getAll().then((response) => {
      setUser(response.find((user) => user.id === id))
    })
  }, [])

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}
