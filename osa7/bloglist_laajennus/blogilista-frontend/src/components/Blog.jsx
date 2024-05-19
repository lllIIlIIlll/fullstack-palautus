import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

import UserContext from '../UserContext'

export const BlogCover = ({ blog }) => {
  return (
    <div>
      <p>
        {blog.title} {blog.author}{' '}
      </p>
    </div>
  )
}

export const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [user, userDispatch] = useContext(UserContext)

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}{' '}
          <Button
            data-testid="like-btn"
            onClick={() => likeBlog(blog.id, blog.title)}
          >
            like
          </Button>
        </p>
        <p>{blog.user.name}</p>
        {user.username === blog.user.username ? (
          <Button
            variant="danger"
            onClick={() => removeBlog(blog.id, blog.title)}
          >
            remove
          </Button>
        ) : null}
      </div>
    </div>
  )
}

Blog.propTypes = {
  removeBlog: PropTypes.func.isRequired,
}
