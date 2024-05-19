import { useContext } from 'react'
import UserContext from '../UserContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export const Header = () => {
  const [user, userDispatch] = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedIn')
    userDispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'lightgrey',
          borderRadius: '0 0 5px 5px',
        }}
      >
        <p style={{ margin: '10px 0 10px 10px' }}>
          <Link to={'/'}>blogs</Link>
        </p>
        <p style={{ margin: '10px 0 10px 10px' }}>
          <Link to={'/users'}>users</Link>
        </p>
        <p style={{ margin: '10px 0 10px 10px' }}>
          {`${user.name} logged in`}{' '}
          <Button
            variant="secondary"
            style={{ margin: '10px 0 10px 10px' }}
            onClick={() => handleLogout()}
          >
            logout
          </Button>
        </p>
      </div>
      <h1 style={{ margin: '10px 0 10px 0' }}>blogs</h1>
    </div>
  )
}
