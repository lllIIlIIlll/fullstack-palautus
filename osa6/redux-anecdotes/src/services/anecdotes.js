import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const obj = { content, votes: 0}
  const response = await axios.post(baseUrl, obj)
  return response.data
}

const update = async (id) => {
  const anecdotes = await getAll()
  const anecdoteToVote = anecdotes.find(idx => idx.id === id)
  const votedAnecdote = {
    ...anecdoteToVote,
    votes: anecdoteToVote.votes + 1
  }
  const response = await axios.put(`${baseUrl}/${id}`, votedAnecdote)
  return response.data
}

export default { getAll, createNew, update }