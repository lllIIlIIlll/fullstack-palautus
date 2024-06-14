import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props, token) => {
  const [genre, setGenre] = useState(null)
  const [allGenres, setAllGenres] = useState([])
  const [books, setBooks] = useState([])

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      setBooks(await data.allBooks)
    },
  })

  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (result.data) {
      if (!genre) {
        setAllGenres([
          ...new Set(result.data.allBooks.flatMap((b) => b.genres)),
        ])
      }
      setBooks(result.data.allBooks)
    }
  }, [result.data, genre])

  if (!props.show) {
    return null
  }

  if (!token) setGenre(null)

  if (result.loading) {
    return <div>loading...</div>
  }

  const filterGenres = (e) => {
    selected === e.target.value
      ? (setGenre(null), setSelected(null))
      : (setGenre(e.target.value), setSelected(e.target.value))
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre patterns</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {allGenres.map((genre) => (
        <button
          key={genre}
          value={genre}
          onClick={(e) => filterGenres(e)}
          style={{
            background: genre === selected ? 'lightblue' : 'lightgrey',
            border: 'none',
            borderRadius: '5px',
            padding: genre === selected ? '7px' : '5px',
            margin: '3px',
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Books
