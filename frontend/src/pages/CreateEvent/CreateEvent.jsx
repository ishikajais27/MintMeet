// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import EventForm from '../../components/events/EventForm/EventForm'
// import { useEvents } from '../../hooks/useEvents'
// import Notification from '../../components/common/Notification/Notification'
// import './CreateEvent.css'

// const CreateEvent = () => {
//   const navigate = useNavigate()
//   const { createEvent, loading, error } = useEvents()
//   const [notification, setNotification] = useState({
//     show: false,
//     message: '',
//     type: '',
//   })

//   const handleSubmit = async (eventData) => {
//     try {
//       // Clear any previous notifications
//       setNotification({ show: false, message: '', type: '' })

//       const result = await createEvent(eventData)

//       setNotification({
//         show: true,
//         message: 'Event created successfully!',
//         type: 'success',
//       })

//       // Redirect or clear form after success
//       console.log('Event created:', result)

//       // Optional: Redirect after a delay
//       setTimeout(() => {
//         navigate('/dashboard') // or wherever you want to redirect
//       }, 2000)
//     } catch (error) {
//       console.error('Error in CreateEvent:', error)

//       // Display error notification
//       setNotification({
//         show: true,
//         message: error.response?.data?.message || 'Failed to create event',
//         type: 'error',
//       })
//     }
//   }

//   const handleNotificationClose = () => {
//     setNotification({ show: false, message: '', type: '' })
//   }

//   return (
//     <div className="create-event">
//       <div className="container">
//         <div className="create-event-header">
//           <h1 className="create-event-title">Create New Event</h1>
//           <p className="create-event-subtitle">
//             Fill in the details below to create your event and start issuing
//             digital badges.
//           </p>
//         </div>

//         {/* Show success/error notifications */}
//         {notification.show && (
//           <Notification
//             message={notification.message}
//             type={notification.type}
//             isVisible={notification.show}
//             onClose={handleNotificationClose}
//           />
//         )}

//         {/* Show error from useEvents hook if needed */}
//         {error && !notification.show && (
//           <Notification message={error} type="error" isVisible={!!error} />
//         )}

//         <div className="create-event-content">
//           <EventForm onSubmit={handleSubmit} loading={loading} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CreateEvent
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventForm from '../../components/events/EventForm/EventForm'
import { useEvents } from '../../hooks/useEvents'
import Notification from '../../components/common/Notification/Notification'
import './CreateEvent.css'

const CreateEvent = () => {
  const navigate = useNavigate()
  const { createEvent, loading, error } = useEvents()
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  })

  const handleSubmit = async (eventData) => {
    try {
      // Clear any previous notifications
      setNotification({ show: false, message: '', type: '' })

      const result = await createEvent(eventData)

      setNotification({
        show: true,
        message: 'Event created successfully!',
        type: 'success',
      })

      // Redirect after a delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error in CreateEvent:', error)

      // Display error notification
      setNotification({
        show: true,
        message: error.message || 'Failed to create event',
        type: 'error',
      })
    }
  }

  const handleNotificationClose = () => {
    setNotification({ show: false, message: '', type: '' })
  }

  return (
    <div className="create-event">
      <div className="container">
        <div className="create-event-header">
          <h1 className="create-event-title">Create New Event</h1>
          <p className="create-event-subtitle">
            Fill in the details below to create your event and start issuing
            digital badges.
          </p>
        </div>

        {/* Show success/error notifications */}
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            isVisible={notification.show}
            onClose={handleNotificationClose}
          />
        )}

        {/* Show error from useEvents hook if needed */}
        {error && !notification.show && (
          <Notification message={error} type="error" isVisible={!!error} />
        )}

        <div className="create-event-content">
          <EventForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
