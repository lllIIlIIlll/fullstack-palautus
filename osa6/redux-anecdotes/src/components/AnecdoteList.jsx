import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    return sortedAnecdotes.filter(anecdote => anecdote.content.includes(filter))
  })
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted: ${anecdotes.find(anecdote => anecdote.id === id).content}`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList