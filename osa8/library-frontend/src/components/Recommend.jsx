import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { USER, ALL_BOOKS } from '../queries'

export const Recommend = ({ show, token }) => {
  const [favoriteGenre, setFavoriteGenre] = useState(null)

  const { data: user, loading: userLoading } = useQuery(USER, {
    skip: !token,
  })

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    if (user && user.me.favoriteGenre) {
      setFavoriteGenre(user.me.favoriteGenre)
    }
  }, [user])

  if (userLoading || booksLoading) {
    return <div>loading...</div>
  }

  if (!show) return null

  if (booksData) {
    return (
      <>
        <h2>recommendations</h2>
        <p>book in your favorite genre patterns</p>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {booksData.allBooks.map((a) =>
              a.genres.includes(favoriteGenre) ? (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </>
    )
  } else {
    return null
  }
}
