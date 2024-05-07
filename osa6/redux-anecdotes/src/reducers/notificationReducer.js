import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    displayNotification(state, action) {
      return action.payload
    },
    hideNotification(state, action) {
      return ''
    }
  }
})

export const { displayNotification, hideNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(displayNotification(message))
    setTimeout(() => {
      dispatch(hideNotification())
    }, Number(`${time}000`))
  }
}

export default notificationSlice.reducer