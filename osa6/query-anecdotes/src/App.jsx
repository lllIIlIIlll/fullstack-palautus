import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

import NotificationContext from './NotificationContext'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  
  const updateAnecdoteMutation = useMutation( {
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1})
    dispatch({ type: "SHOW", content: `you voted: ${anecdote.content}` })
    setTimeout(() => {
      dispatch("HIDE")
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if ( result.isLoading ) {
    return <p>anecdote service not available due to problems in server</p>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
