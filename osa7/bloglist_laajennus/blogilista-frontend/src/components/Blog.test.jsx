import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog
let userForTest

beforeEach(() => {
  blog = {
    title: 'testailua',
    author: 'testi',
    url: 'http://localhost:3003',
    likes: 5,
    user: {
      name: 'Testi Käyttäjä',
    },
  }

  userForTest = {
    username: 'testik',
  }
})

test('renders blog title', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText('testailua', { exact: false })
  expect(element).toBeDefined()
})

test('renders url, likes and user when view button is pressed', async () => {
  render(<Blog user={userForTest} blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('http://localhost:3003')
  expect(urlElement).toBeDefined()

  const likeElement = screen.getByText('likes 5')
  expect(likeElement).toBeDefined()

  const userElement = screen.getByText('Testi Käyttäjä')
  expect(userElement).toBeDefined()
})

test('like button functions properly', async () => {
  const likeBlog = vi.fn()
  render(<Blog user={userForTest} blog={blog} likeBlog={likeBlog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(likeBlog.mock.calls).toHaveLength(2)
})
