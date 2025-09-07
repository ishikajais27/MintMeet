// import React from 'react'
// import { Link } from 'react-router-dom'
// import Button from '../../common/Button/Button'
// import { DEFAULTS } from '../../../utils/constants'
// import './EventCard.css'

// export const EventCard = ({ event }) => {
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       })
//     } catch (error) {
//       return 'Invalid date'
//     }
//   }

//   // Get the image URL - handle both backend and mock data formats
//   const getImageUrl = () => {
//     if (event.templateImage) {
//       // If it's a full URL or relative path from backend
//       if (typeof event.templateImage === 'string') {
//         return event.templateImage.startsWith('http')
//           ? event.templateImage
//           : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${
//               event.templateImage
//             }`
//       }
//     }
//     return DEFAULTS.EVENT_IMAGE
//   }

//   return (
//     <div className="event-card">
//       <div className="event-card__image">
//         <img
//           src={getImageUrl()}
//           alt={event.name}
//           onError={(e) => {
//             e.target.src = DEFAULTS.EVENT_IMAGE
//           }}
//         />
//       </div>

//       <div className="event-card__content">
//         <h3 className="event-card__title">{event.name}</h3>
//         <p className="event-card__date">{formatDate(event.date)}</p>
//         {event.organizer && (
//           <p className="event-card__organizer">By: {event.organizer}</p>
//         )}
//         <div className="event-card__actions">
//           <Button
//             as={Link}
//             to={`/event/${event._id}`}
//             variant="primary"
//             size="small"
//           >
//             View Details
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EventCard
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../common/Button/Button'
import { DEFAULTS } from '../../../utils/constants'
import './EventCard.css'

export const EventCard = ({ event, onDelete, showDeleteButton = false }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Get the image URL - handle both backend and mock data formats
  const getImageUrl = () => {
    if (event.templateImage) {
      // If it's a full URL or relative path from backend
      if (typeof event.templateImage === 'string') {
        return event.templateImage.startsWith('http')
          ? event.templateImage
          : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${
              event.templateImage
            }`
      }
    }
    return DEFAULTS.EVENT_IMAGE
  }

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event._id)
    }
  }

  return (
    <div className="event-card">
      <div className="event-card__image">
        <img
          src={getImageUrl()}
          alt={event.name}
          onError={(e) => {
            e.target.src = DEFAULTS.EVENT_IMAGE
          }}
        />
        {showDeleteButton && (
          <button className="event-card__delete" onClick={handleDelete}>
            ×
          </button>
        )}
      </div>

      <div className="event-card__content">
        <h3 className="event-card__title">{event.name}</h3>
        <p className="event-card__date">{formatDate(event.date)}</p>
        {event.organizer && (
          <p className="event-card__organizer">By: {event.organizer}</p>
        )}
        <div className="event-card__actions">
          <Button
            as={Link}
            to={`/event/${event._id}`}
            variant="primary"
            size="small"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EventCard
