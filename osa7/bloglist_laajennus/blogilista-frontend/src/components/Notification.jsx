import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  if (notification === null) {
    return null
  } else {
    return (
      <>
        <Alert>{notification}</Alert>
      </>
    )
  }
}

export default Notification
