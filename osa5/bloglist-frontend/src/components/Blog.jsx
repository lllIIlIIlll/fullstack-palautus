import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ user, blog, likeBlog, removeBlog }) => {
  const [view, setView] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blogContent'>
      <p>{blog.title} {blog.author} <button data-testid='view-btn' onClick={() => setView(!view)}>{view ? 'view' : 'hide'}</button></p>
      {!view ? <div>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button data-testid='like-btn' onClick={() => likeBlog(blog.id)}>like</button></p>
        <p>{blog.user.name}</p>
        {user.username === blog.user.username ? <button onClick={() => removeBlog(blog.id, blog.title)}>remove</button> : null}
      </div>
        : null}
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog