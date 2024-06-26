import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

import { createAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  
  const newAnecdoteMutation = useMutation( {
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    },
    onError: (error) => {
      dispatch({ type: "SHOW", content: error.message })
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  
    dispatch({ type: "SHOW", content: `anecdote created: ${content}` })
    setTimeout(() => {
      dispatch("HIDE")
    }, 5000)
  }


  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
