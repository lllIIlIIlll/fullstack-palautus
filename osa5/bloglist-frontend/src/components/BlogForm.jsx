import { useState } from 'react'
import PropTypes from 'prop-types'

export const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div style={{ 'display': 'flex', 'flexDirection': 'column', 'width': '300px' }}>
          <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center' }}>
            <p>title:</p>
            <input
              id='title-input'
              style={{ 'height': '15px' }}
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center' }}>
            <p>author:</p>
            <input
              id='author-input'
              style={{ 'height': '15px' }}
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center' }}>
            <p>url:</p>
            <input
              id='url-input'
              style={{ 'height': '15px' }}
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}