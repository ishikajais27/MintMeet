// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import EventList from '../../components/events/EventList/EventList'
// import Button from '../../components/common/Button/Button'
// import { useEvents } from '../../hooks/useEvents'
// import Notification from '../../components/common/Notification/Notification'
// import './Dashboard.css'

// const Dashboard = () => {
//   const { events, loading, error, fetchEvents } = useEvents()

//   useEffect(() => {
//     fetchEvents()
//   }, [fetchEvents])

//   // Handle both response formats
//   const eventList = events?.data || events || []

//   return (
//     <div className="dashboard">
//       <div className="container">
//         <div className="dashboard-header">
//           <div className="dashboard-header__content">
//             <h1 className="dashboard-title">My Events</h1>
//             <p className="dashboard-subtitle">
//               Manage your events and issue digital badges to attendees.
//             </p>
//           </div>
//           <Button as={Link} to="/create-event" variant="primary">
//             Create New Event
//           </Button>
//         </div>

//         <Notification message={error} type="error" isVisible={!!error} />

//         <div className="dashboard-content">
//           <EventList
//             events={eventList} // Use the properly formatted event list
//             loading={loading}
//             error={error}
//           />

//           {error && (
//             <div className="dashboard-retry">
//               <Button onClick={handleRetry} variant="outline">
//                 Try Again
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
// export default Dashboard
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EventList from '../../components/events/EventList/EventList'
import Button from '../../components/common/Button/Button'
import { useEvents } from '../../hooks/useEvents'
import Notification from '../../components/common/Notification/Notification'
import './Dashboard.css'

const Dashboard = () => {
  const { events, loading, error, fetchEvents, deleteEvent } = useEvents()

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleRetry = () => {
    fetchEvents()
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId)
      // Refresh the events list after deletion
      fetchEvents()
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-header__content">
            <h1 className="dashboard-title">My Events</h1>
            <p className="dashboard-subtitle">
              Manage your events and issue digital badges to attendees.
            </p>
          </div>
          <Button as={Link} to="/create-event" variant="primary">
            Create New Event
          </Button>
        </div>

        <Notification message={error} type="error" isVisible={!!error} />

        <div className="dashboard-content">
          <EventList
            events={events.data || events} // Handle both response formats
            loading={loading}
            error={error}
            onDeleteEvent={handleDeleteEvent}
          />

          {error && (
            <div className="dashboard-retry">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
