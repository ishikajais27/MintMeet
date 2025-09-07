// // import React from 'react'
// // import Loader from '../../common/Loader/Loader'
// // import { getBadgeImageUrl } from '../../utils/badgeHelpers'
// // import './AttendeeList.css'

// // const AttendeeList = ({
// //   attendees,
// //   loading,
// //   error,
// //   onMarkAttendance,
// //   onUpdateAttendee,
// //   onDeleteAttendee,
// // }) => {
// //   if (loading) {
// //     return (
// //       <div className="attendee-list-loading">
// //         <Loader size="medium" />
// //         <p>Loading attendees...</p>
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className="attendee-list-error">
// //         <p className="error-message">Error loading attendees: {error}</p>
// //       </div>
// //     )
// //   }

// //   if (attendees.length === 0) {
// //     return (
// //       <div className="attendee-list-empty">
// //         <p>No attendees registered yet.</p>
// //       </div>
// //     )
// //   }

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //     })
// //   }

// //   const shortenAddress = (address) => {
// //     if (!address) return 'Not provided'
// //     return `${address.slice(0, 6)}...${address.slice(-4)}`
// //   }

// //   const handleToggleAttendance = async (attendeeId, currentStatus) => {
// //     if (onMarkAttendance) {
// //       try {
// //         await onMarkAttendance(attendeeId, currentStatus)
// //       } catch (error) {
// //         console.error('Error toggling attendance:', error)
// //       }
// //     }
// //   }

// //   const handleDeleteAttendee = async (attendeeId, attendeeName) => {
// //     if (
// //       onDeleteAttendee &&
// //       window.confirm(`Are you sure you want to delete ${attendeeName}?`)
// //     ) {
// //       try {
// //         await onDeleteAttendee(attendeeId)
// //       } catch (error) {
// //         console.error('Error deleting attendee:', error)
// //       }
// //     }
// //   }

// //   return (
// //     <div className="attendee-list">
// //       <div className="attendee-list-header">
// //         <h3 className="attendee-list-title">
// //           Registered Attendees ({attendees.length})
// //         </h3>
// //       </div>

// //       <div className="attendee-table-container">
// //         <table className="attendee-table">
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Wallet Address</th>
// //               <th>Registration Status</th>
// //               <th>Attendance</th>
// //               <th>Registered</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {attendees.map((attendee) => (
// //               <tr key={attendee._id} className="attendee-row">
// //                 <td className="attendee-name">{attendee.name}</td>
// //                 <td className="attendee-email">{attendee.email}</td>
// //                 <td className="attendee-wallet" title={attendee.walletAddress}>
// //                   {shortenAddress(attendee.walletAddress)}
// //                 </td>
// //                 <td className="attendee-status">
// //                   <span
// //                     className={`status-badge ${
// //                       attendee.hasRegistered
// //                         ? 'status-registered'
// //                         : 'status-pending'
// //                     }`}
// //                   >
// //                     {attendee.hasRegistered ? 'Registered' : 'Pending'}
// //                   </span>
// //                 </td>
// //                 <td className="attendee-attendance">
// //                   <span
// //                     className={`status-badge ${
// //                       attendee.hasAttended
// //                         ? 'status-attended'
// //                         : 'status-pending'
// //                     }`}
// //                   >
// //                     {attendee.hasAttended ? 'Attended' : 'Pending'}
// //                   </span>
// //                 </td>
// //                 <td className="attendee-date">
// //                   {formatDate(attendee.registeredAt)}
// //                 </td>
// //                 <td className="attendee-actions">
// //                   <button
// //                     onClick={() =>
// //                       handleToggleAttendance(attendee._id, attendee.hasAttended)
// //                     }
// //                     className={`attendance-button ${
// //                       attendee.hasAttended ? 'attended' : ''
// //                     }`}
// //                     title={
// //                       attendee.hasAttended
// //                         ? 'Mark as not attended'
// //                         : 'Mark as attended'
// //                     }
// //                   >
// //                     {attendee.hasAttended ? '✓' : '✗'}
// //                   </button>
// //                   <button
// //                     onClick={() =>
// //                       handleDeleteAttendee(attendee._id, attendee.name)
// //                     }
// //                     className="delete-button"
// //                     title="Delete attendee"
// //                   >
// //                     ×
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AttendeeList
// import React from 'react'
// import Loader from '../../common/Loader/Loader'
// import { getBadgeImageUrl } from '../../../utils/badgeHelpers'
// import './AttendeeList.css'

// const AttendeeList = ({
//   attendees,
//   loading,
//   error,
//   onMarkAttendance,
//   onUpdateAttendee,
//   onDeleteAttendee,
// }) => {
//   if (loading) {
//     return (
//       <div className="attendee-list-loading">
//         <Loader size="medium" />
//         <p>Loading attendees...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="attendee-list-error">
//         <p className="error-message">Error loading attendees: {error}</p>
//       </div>
//     )
//   }

//   if (attendees.length === 0) {
//     return (
//       <div className="attendee-list-empty">
//         <p>No attendees registered yet.</p>
//       </div>
//     )
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     })
//   }

//   const shortenAddress = (address) => {
//     if (!address) return 'Not provided'
//     return `${address.slice(0, 6)}...${address.slice(-4)}`
//   }

//   const handleToggleAttendance = async (attendeeId, currentStatus) => {
//     if (onMarkAttendance) {
//       try {
//         await onMarkAttendance(attendeeId, currentStatus)
//       } catch (error) {
//         console.error('Error toggling attendance:', error)
//       }
//     }
//   }

//   const handleDeleteAttendee = async (attendeeId, attendeeName) => {
//     if (
//       onDeleteAttendee &&
//       window.confirm(`Are you sure you want to delete ${attendeeName}?`)
//     ) {
//       try {
//         await onDeleteAttendee(attendeeId)
//       } catch (error) {
//         console.error('Error deleting attendee:', error)
//       }
//     }
//   }

//   return (
//     <div className="attendee-list">
//       <div className="attendee-list-header">
//         <h3 className="attendee-list-title">
//           Registered Attendees ({attendees.length})
//         </h3>
//       </div>

//       <div className="attendee-table-container">
//         <table className="attendee-table">
//           <thead>
//             <tr>
//               <th>Badge</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Wallet Address</th>
//               <th>Registration Status</th>
//               <th>Attendance</th>
//               <th>Badge Status</th>
//               <th>Registered</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendees.map((attendee) => (
//               <tr key={attendee._id} className="attendee-row">
//                 <td className="attendee-badge">
//                   {attendee.hasReceivedBadge && attendee.badgeImage ? (
//                     <img
//                       src={getBadgeImageUrl(attendee.badgeImage)}
//                       alt={`${attendee.name}'s badge`}
//                       className="badge-image"
//                       onError={(e) => {
//                         e.target.src = '/placeholder-badge.png'
//                         e.target.classList.add('badge-image-error')
//                       }}
//                     />
//                   ) : (
//                     <div className="badge-placeholder">
//                       {attendee.hasAttended ? '🔄' : '⏳'}
//                     </div>
//                   )}
//                 </td>
//                 <td className="attendee-name">{attendee.name}</td>
//                 <td className="attendee-email">{attendee.email}</td>
//                 <td className="attendee-wallet" title={attendee.walletAddress}>
//                   {shortenAddress(attendee.walletAddress)}
//                 </td>
//                 <td className="attendee-status">
//                   <span
//                     className={`status-badge ${
//                       attendee.hasRegistered
//                         ? 'status-registered'
//                         : 'status-pending'
//                     }`}
//                   >
//                     {attendee.hasRegistered ? 'Registered' : 'Pending'}
//                   </span>
//                 </td>
//                 <td className="attendee-attendance">
//                   <span
//                     className={`status-badge ${
//                       attendee.hasAttended
//                         ? 'status-attended'
//                         : 'status-pending'
//                     }`}
//                   >
//                     {attendee.hasAttended ? 'Attended' : 'Pending'}
//                   </span>
//                 </td>
//                 <td className="attendee-badge-status">
//                   <span
//                     className={`status-badge ${
//                       attendee.hasReceivedBadge
//                         ? 'status-minted'
//                         : attendee.hasAttended
//                         ? 'status-ready'
//                         : 'status-pending'
//                     }`}
//                   >
//                     {attendee.hasReceivedBadge
//                       ? 'Minted'
//                       : attendee.hasAttended
//                       ? 'Ready'
//                       : 'Pending'}
//                   </span>
//                 </td>
//                 <td className="attendee-date">
//                   {formatDate(attendee.registeredAt)}
//                 </td>
//                 <td className="attendee-actions">
//                   <button
//                     onClick={() =>
//                       handleToggleAttendance(attendee._id, attendee.hasAttended)
//                     }
//                     className={`attendance-button ${
//                       attendee.hasAttended ? 'attended' : ''
//                     }`}
//                     title={
//                       attendee.hasAttended
//                         ? 'Mark as not attended'
//                         : 'Mark as attended'
//                     }
//                     disabled={attendee.hasReceivedBadge}
//                   >
//                     {attendee.hasAttended ? '✓' : '✗'}
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleDeleteAttendee(attendee._id, attendee.name)
//                     }
//                     className="delete-button"
//                     title="Delete attendee"
//                     disabled={attendee.hasReceivedBadge}
//                   >
//                     ×
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default AttendeeList
import React from 'react'
import Loader from '../../common/Loader/Loader'
import { getBadgeImageUrl } from '../../../utils/badgeHelpers'
import './AttendeeList.css'

const AttendeeList = ({
  attendees,
  loading,
  error,
  onMarkAttendance,
  onUpdateAttendee,
  onDeleteAttendee,
}) => {
  if (loading) {
    return (
      <div className="attendee-list-loading">
        <Loader size="medium" />
        <p>Loading attendees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="attendee-list-error">
        <p className="error-message">Error loading attendees: {error}</p>
      </div>
    )
  }

  if (attendees.length === 0) {
    return (
      <div className="attendee-list-empty">
        <p>No attendees registered yet.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const shortenAddress = (address) => {
    if (!address) return 'Not provided'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleToggleAttendance = async (attendeeId, currentStatus) => {
    if (onMarkAttendance) {
      try {
        await onMarkAttendance(attendeeId, currentStatus)
      } catch (error) {
        console.error('Error toggling attendance:', error)
      }
    }
  }

  const handleDeleteAttendee = async (attendeeId, attendeeName) => {
    if (
      onDeleteAttendee &&
      window.confirm(`Are you sure you want to delete ${attendeeName}?`)
    ) {
      try {
        await onDeleteAttendee(attendeeId)
      } catch (error) {
        console.error('Error deleting attendee:', error)
      }
    }
  }

  return (
    <div className="attendee-list">
      <div className="attendee-list-header">
        <h3 className="attendee-list-title">
          Registered Attendees ({attendees.length})
        </h3>
      </div>

      <div className="attendee-table-container">
        <table className="attendee-table">
          <thead>
            <tr>
              <th>Badge</th>
              <th>Name</th>
              <th>Email</th>
              <th>Wallet Address</th>
              <th>Registration Status</th>
              <th>Attendance</th>
              <th>Badge Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee._id} className="attendee-row">
                <td className="attendee-badge">
                  {attendee.hasReceivedBadge && attendee.badgeImage ? (
                    <img
                      src={getBadgeImageUrl(attendee.badgeImage)}
                      alt={`${attendee.name}'s badge`}
                      className="badge-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-badge.png'
                        e.target.classList.add('badge-image-error')
                      }}
                    />
                  ) : (
                    <div className="badge-placeholder">
                      {attendee.hasAttended ? '🔄' : '⏳'}
                    </div>
                  )}
                </td>
                <td className="attendee-name">{attendee.name}</td>
                <td className="attendee-email">{attendee.email}</td>
                <td className="attendee-wallet" title={attendee.walletAddress}>
                  {shortenAddress(attendee.walletAddress)}
                </td>
                <td className="attendee-status">
                  <span
                    className={`status-badge ${
                      attendee.hasRegistered
                        ? 'status-registered'
                        : 'status-pending'
                    }`}
                  >
                    {attendee.hasRegistered ? 'Registered' : 'Pending'}
                  </span>
                </td>
                <td className="attendee-attendance">
                  <span
                    className={`status-badge ${
                      attendee.hasAttended
                        ? 'status-attended'
                        : 'status-pending'
                    }`}
                  >
                    {attendee.hasAttended ? 'Attended' : 'Pending'}
                  </span>
                </td>
                <td className="attendee-badge-status">
                  <span
                    className={`status-badge ${
                      attendee.hasReceivedBadge
                        ? 'status-minted'
                        : attendee.hasAttended
                        ? 'status-ready'
                        : 'status-pending'
                    }`}
                  >
                    {attendee.hasReceivedBadge
                      ? 'Minted'
                      : attendee.hasAttended
                      ? 'Ready'
                      : 'Pending'}
                  </span>
                </td>
                <td className="attendee-date">
                  {formatDate(attendee.registeredAt)}
                </td>
                <td className="attendee-actions">
                  <button
                    onClick={() =>
                      handleToggleAttendance(attendee._id, attendee.hasAttended)
                    }
                    className={`attendance-button ${
                      attendee.hasAttended ? 'attended' : ''
                    }`}
                    title={
                      attendee.hasAttended
                        ? 'Mark as not attended'
                        : 'Mark as attended'
                    }
                    disabled={attendee.hasReceivedBadge}
                  >
                    {attendee.hasAttended ? '✓' : '✗'}
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteAttendee(attendee._id, attendee.name)
                    }
                    className="delete-button"
                    title="Delete attendee"
                    disabled={attendee.hasReceivedBadge}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendeeList
