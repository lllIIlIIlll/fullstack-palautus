import { render, screen } from '@testing-library/react'
import { BlogForm } from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm />', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const title = container.querySelector('#title-input')
  const author = container.querySelector('#author-input')
  const url = container.querySelector('#url-input')

  await user.type(title, 'testi title')
  await user.type(author, 'testi author')
  await user.type(url, 'testi url')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testi title')
  expect(createBlog.mock.calls[0][0].author).toBe('testi author')
  expect(createBlog.mock.calls[0][0].url).toBe('testi url')
})
