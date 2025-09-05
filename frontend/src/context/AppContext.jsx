import React, { createContext, useContext, useReducer } from 'react'

// Notification types
const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
}

// Initial state
const initialState = {
  notifications: [],
}

// Action types
const actionTypes = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      }

    case actionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      }

    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addNotification = (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      ...notification,
      timestamp: Date.now(),
    }

    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: newNotification })

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)

    return id
  }

  const removeNotification = (id) => {
    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id })
  }

  const clearNotifications = () => {
    dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS })
  }

  const value = {
    ...state,
    addNotification,
    removeNotification,
    clearNotifications,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
