// // import React, { useState, useEffect } from 'react'
// // import { useParams, Link } from 'react-router-dom'
// // import { useEvents } from '../../hooks/useEvents'
// // import { useAttendees } from '../../hooks/useAttendees'
// // import Loader from '../../common/Loader/Loader'
// // import Button from '../../common/Button/Button'
// // import CSVUploader from '../../components/CSVUploader/CSVUploader'
// // import AttendeeList from '../../components/AttendeeList/AttendeeList'
// // import { DEFAULTS } from '../../../utils/constants'
// // import './EventDetailPage.css'

// // const EventDetailPage = () => {
// //   const { id } = useParams()
// //   const { getEventById, loading, error } = useEvents()
// //   const {
// //     getAttendees,
// //     addAttendees,
// //     markAttendance,
// //     attendees,
// //     loading: attendeesLoading,
// //   } = useAttendees()
// //   const [event, setEvent] = useState(null)
// //   const [showCSVUploader, setShowCSVUploader] = useState(false)
// //   const [uploadMessage, setUploadMessage] = useState('')

// //   useEffect(() => {
// //     const fetchEvent = async () => {
// //       try {
// //         const eventData = await getEventById(id)
// //         setEvent(eventData)

// //         // Fetch attendees for this event
// //         await getAttendees(id)
// //       } catch (err) {
// //         console.error('Error fetching event:', err)
// //       }
// //     }

// //     if (id) {
// //       fetchEvent()
// //     }
// //   }, [id, getEventById, getAttendees])

// //   const handleCSVUpload = async (formData) => {
// //     try {
// //       setUploadMessage('Uploading...')
// //       const response = await addAttendees(formData)

// //       if (response.success) {
// //         setUploadMessage(
// //           `Successfully processed ${response.data.processed} attendees. ${response.data.errors} errors.`
// //         )

// //         // Refresh attendees list
// //         await getAttendees(id)

// //         // Hide uploader after successful upload
// //         setTimeout(() => {
// //           setShowCSVUploader(false)
// //           setUploadMessage('')
// //         }, 3000)
// //       } else {
// //         setUploadMessage(`Upload failed: ${response.message}`)
// //       }
// //     } catch (error) {
// //       console.error('Error uploading CSV:', error)
// //       setUploadMessage(`Upload error: ${error.message}`)
// //     }
// //   }

// //   const handleMarkAttendance = async (attendeeId) => {
// //     try {
// //       await markAttendance(attendeeId)
// //       // Refresh attendees list
// //       await getAttendees(id)
// //     } catch (error) {
// //       console.error('Error marking attendance:', error)
// //     }
// //   }

// //   const getImageUrl = () => {
// //     if (event?.templateImage) {
// //       return event.templateImage.startsWith('http')
// //         ? event.templateImage
// //         : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${
// //             event.templateImage
// //           }`
// //     }
// //     return DEFAULTS.EVENT_IMAGE
// //   }

// //   const formatDate = (dateString) => {
// //     try {
// //       return new Date(dateString).toLocaleDateString('en-US', {
// //         year: 'numeric',
// //         month: 'long',
// //         day: 'numeric',
// //       })
// //     } catch (error) {
// //       return 'Invalid date'
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="event-detail-loading">
// //         <Loader size="large" />
// //         <p>Loading event details...</p>
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className="event-detail-error">
// //         <h2>Error</h2>
// //         <p>{error}</p>
// //         <Button as={Link} to="/events" variant="primary">
// //           Back to Events
// //         </Button>
// //       </div>
// //     )
// //   }

// //   if (!event) {
// //     return (
// //       <div className="event-detail-not-found">
// //         <h2>Event Not Found</h2>
// //         <p>The event you're looking for doesn't exist.</p>
// //         <Button as={Link} to="/events" variant="primary">
// //           Back to Events
// //         </Button>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="event-detail">
// //       <div className="event-detail__header">
// //         <Button as={Link} to="/events" variant="secondary" size="small">
// //           ← Back to Events
// //         </Button>
// //         <h1 className="event-detail__title">{event.name}</h1>
// //       </div>

// //       <div className="event-detail__content">
// //         <div className="event-detail__image">
// //           <img
// //             src={getImageUrl()}
// //             alt={event.name}
// //             onError={(e) => {
// //               e.target.src = DEFAULTS.EVENT_IMAGE
// //             }}
// //           />
// //         </div>

// //         <div className="event-detail__info">
// //           <div className="event-detail__section">
// //             <h3>Event Details</h3>
// //             <p>
// //               <strong>Date:</strong> {formatDate(event.date)}
// //             </p>
// //             <p>
// //               <strong>Organizer:</strong> {event.organizer}
// //             </p>
// //             {event.description && (
// //               <p>
// //                 <strong>Description:</strong> {event.description}
// //               </p>
// //             )}
// //           </div>

// //           <div className="event-detail__section">
// //             <div className="event-detail__actions">
// //               <h3>Attendees ({attendees.length || 0})</h3>
// //               <Button
// //                 onClick={() => setShowCSVUploader(!showCSVUploader)}
// //                 variant="primary"
// //                 size="small"
// //               >
// //                 {showCSVUploader ? 'Cancel Upload' : 'Upload CSV'}
// //               </Button>
// //             </div>

// //             {showCSVUploader && (
// //               <div className="event-detail__csv-uploader">
// //                 <CSVUploader
// //                   onUpload={handleCSVUpload}
// //                   loading={attendeesLoading}
// //                   eventId={event._id}
// //                 />
// //                 {uploadMessage && (
// //                   <div
// //                     className={`upload-message ${
// //                       uploadMessage.includes('Success') ? 'success' : 'error'
// //                     }`}
// //                   >
// //                     {uploadMessage}
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             <AttendeeList
// //               attendees={attendees}
// //               loading={attendeesLoading}
// //               onMarkAttendance={handleMarkAttendance}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default EventDetailPage
// import React, { useState, useEffect } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { useEvents } from '../../hooks/useEvents'
// import { useAttendees } from '../../hooks/useAttendees'
// import Loader from '../../common/Loader/Loader'
// import Button from '../../common/Button/Button'
// import CSVUploader from '../../components/CSVUploader/CSVUploader'
// import AttendeeList from '../../components/AttendeeList/AttendeeList'
// import { DEFAULTS } from '../../../utils/constants'
// import attendeeService from '../../services/attendeeService'
// import './EventDetailPage.css'

// const EventDetailPage = () => {
//   const { id } = useParams()
//   const { getEventById, loading, error } = useEvents()
//   const {
//     getAttendees,
//     addAttendees,
//     markAttendance,
//     attendees,
//     loading: attendeesLoading,
//     error: attendeesError,
//   } = useAttendees()
//   const [event, setEvent] = useState(null)
//   const [showCSVUploader, setShowCSVUploader] = useState(false)
//   const [uploadResult, setUploadResult] = useState(null)

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const eventData = await getEventById(id)
//         setEvent(eventData)
//       } catch (err) {
//         console.error('Error fetching event:', err)
//       }
//     }

//     if (id) {
//       fetchEvent()
//     }
//   }, [id, getEventById])

//   useEffect(() => {
//     // Fetch attendees when event is loaded
//     if (event && event._id) {
//       getAttendees(event._id)
//     }
//   }, [event, getAttendees])

//   const handleCSVUpload = async (formData) => {
//     try {
//       setUploadResult({ type: 'loading', message: 'Uploading CSV file...' })
//       const response = await addAttendees(formData)

//       if (response.success) {
//         setUploadResult({
//           type: 'success',
//           message: `Successfully processed ${response.data.processed} attendees. ${response.data.errors} errors.`,
//           details: response.data,
//         })

//         // Refresh attendees list
//         await getAttendees(event._id)

//         // Hide uploader after 5 seconds
//         setTimeout(() => {
//           setShowCSVUploader(false)
//           setUploadResult(null)
//         }, 5000)
//       } else {
//         setUploadResult({
//           type: 'error',
//           message: response.message || 'Upload failed',
//         })
//       }
//     } catch (error) {
//       console.error('Error uploading CSV:', error)
//       setUploadResult({
//         type: 'error',
//         message: error.message || 'Failed to upload CSV file',
//       })
//     }
//   }

//   const handleMarkAttendance = async (attendeeId) => {
//     try {
//       await markAttendance(attendeeId)
//       // Refresh attendees list
//       await getAttendees(event._id)
//     } catch (error) {
//       console.error('Error marking attendance:', error)
//       // You might want to show a toast notification here
//     }
//   }

//   const getImageUrl = () => {
//     if (event?.templateImage) {
//       return event.templateImage.startsWith('http')
//         ? event.templateImage
//         : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${
//             event.templateImage
//           }`
//     }
//     return DEFAULTS.EVENT_IMAGE
//   }

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

//   const handleExportAttendees = async () => {
//     try {
//       const response = await attendeeService.exportAttendees(event._id)

//       // Create a blob from the response data
//       const blob = new Blob([response], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)

//       // Create a temporary link to download the file
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `attendees-${event._id}.csv`
//       document.body.appendChild(link)
//       link.click()

//       // Clean up
//       window.URL.revokeObjectURL(url)
//       document.body.removeChild(link)
//     } catch (error) {
//       console.error('Error exporting attendees:', error)
//       // Show error notification
//     }
//   }

//   if (loading) {
//     return (
//       <div className="event-detail-loading">
//         <Loader size="large" />
//         <p>Loading event details...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="event-detail-error">
//         <h2>Error</h2>
//         <p>{error}</p>
//         <Button as={Link} to="/events" variant="primary">
//           Back to Events
//         </Button>
//       </div>
//     )
//   }

//   if (!event) {
//     return (
//       <div className="event-detail-not-found">
//         <h2>Event Not Found</h2>
//         <p>The event you're looking for doesn't exist.</p>
//         <Button as={Link} to="/events" variant="primary">
//           Back to Events
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="event-detail">
//       <div className="event-detail__header">
//         <Button as={Link} to="/events" variant="secondary" size="small">
//           ← Back to Events
//         </Button>
//         <h1 className="event-detail__title">{event.name}</h1>
//       </div>

//       <div className="event-detail__content">
//         <div className="event-detail__image">
//           <img
//             src={getImageUrl()}
//             alt={event.name}
//             onError={(e) => {
//               e.target.src = DEFAULTS.EVENT_IMAGE
//             }}
//           />
//         </div>

//         <div className="event-detail__info">
//           <div className="event-detail__section">
//             <h3>Event Details</h3>
//             <p>
//               <strong>Date:</strong> {formatDate(event.date)}
//             </p>
//             <p>
//               <strong>Organizer:</strong> {event.organizer}
//             </p>
//             {event.description && (
//               <p>
//                 <strong>Description:</strong> {event.description}
//               </p>
//             )}
//           </div>

//           <div className="event-detail__section">
//             <div className="event-detail__actions">
//               <h3>Attendees ({attendees.length || 0})</h3>
//               <div className="event-detail__action-buttons">
//                 <Button
//                   onClick={() => setShowCSVUploader(!showCSVUploader)}
//                   variant="primary"
//                   size="small"
//                 >
//                   {showCSVUploader ? 'Cancel Upload' : 'Upload CSV'}
//                 </Button>
//                 <Button
//                   onClick={handleExportAttendees}
//                   variant="outline"
//                   size="small"
//                   disabled={attendees.length === 0}
//                 >
//                   Export CSV
//                 </Button>
//               </div>
//             </div>

//             {showCSVUploader && (
//               <div className="event-detail__csv-uploader">
//                 <CSVUploader
//                   onUpload={handleCSVUpload}
//                   loading={attendeesLoading}
//                   eventId={event._id}
//                 />
//                 {uploadResult && (
//                   <div className={`upload-result ${uploadResult.type}`}>
//                     {uploadResult.message}
//                     {uploadResult.details &&
//                       uploadResult.details.errorDetails && (
//                         <div className="error-details">
//                           <p>Error details:</p>
//                           <ul>
//                             {uploadResult.details.errorDetails
//                               .slice(0, 5)
//                               .map((error, index) => (
//                                 <li key={index}>
//                                   {error.row ? `Row ${error.row}: ` : ''}
//                                   {error.error}
//                                   {error.email ? ` (${error.email})` : ''}
//                                 </li>
//                               ))}
//                           </ul>
//                           {uploadResult.details.errorDetails.length > 5 && (
//                             <p>
//                               ...and{' '}
//                               {uploadResult.details.errorDetails.length - 5}{' '}
//                               more errors
//                             </p>
//                           )}
//                         </div>
//                       )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {attendeesError && (
//               <div className="event-detail__error">
//                 <p className="error-message">
//                   Error loading attendees: {attendeesError}
//                 </p>
//               </div>
//             )}

//             <AttendeeList
//               attendees={attendees}
//               loading={attendeesLoading}
//               onMarkAttendance={handleMarkAttendance}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EventDetailPage
