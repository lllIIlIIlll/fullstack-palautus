import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

import userServices from '../services/users'

export const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userServices.getAll().then((response) => setUsers(response))
  }, [])

  return (
    <>
      <h1>users</h1>

      <Table striped>
        <thead>
          <tr>
            <th>user</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
