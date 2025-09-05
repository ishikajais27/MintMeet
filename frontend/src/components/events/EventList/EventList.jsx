// import React from 'react'
// import EventCard from '../EventCard/EventCard'
// import Loader from '../../common/Loader/Loader'
// import './EventList.css'

// const EventList = ({ events, loading, error }) => {
//   if (loading) {
//     return (
//       <div className="event-list-loading">
//         <Loader size="large" />
//         <p>Loading events...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="event-list-error">
//         <p className="error-message">Error loading events: {error}</p>
//       </div>
//     )
//   }

//   if (events.length === 0) {
//     return (
//       <div className="event-list-empty">
//         <div className="empty-state">
//           <h3>No events yet</h3>
//           <p>
//             Create your first event to get started with issuing digital badges.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="event-list">
//       <div className="event-list__grid">
//         {events.map((event) => (
//           <EventCard key={event._id} event={event} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default EventList
import React from 'react'
import EventCard from '../EventCard/EventCard'
import Loader from '../../common/Loader/Loader'
import './EventList.css'

const EventList = ({ events, loading, error }) => {
  // Handle both response formats: events.data or events array
  const eventList = Array.isArray(events)
    ? events
    : events?.data || events || []

  if (loading) {
    return (
      <div className="event-list-loading">
        <Loader size="large" />
        <p>Loading events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="event-list-error">
        <p className="error-message">Error loading events: {error}</p>
      </div>
    )
  }

  if (eventList.length === 0) {
    return (
      <div className="event-list-empty">
        <div className="empty-state">
          <h3>No events yet</h3>
          <p>
            Create your first event to get started with issuing digital badges.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="event-list">
      <div className="event-list__grid">
        {eventList.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default EventList
