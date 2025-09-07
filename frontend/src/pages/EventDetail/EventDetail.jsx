// import React, { useEffect, useState } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { useEvents } from '../../hooks/useEvents'
// import { useAttendees } from '../../hooks/useAttendees'
// import AttendeeList from '../../components/attendees/AttendeeList/AttendeeList'
// import CSVUploader from '../../components/attendees/CSVUploader/CSVUploader'
// import Button from '../../components/common/Button/Button'
// import Loader from '../../components/common/Loader/Loader'
// import Notification from '../../components/common/Notification/Notification'
// import { DEFAULTS } from '../../utils/constants'
// import { useMinting } from '../../hooks/useMinting'
// import MintButton from '../../components/minting/MintButton/MintButton'
// import MintStatus from '../../components/minting/MintStatus/MintStatus'
// import './EventDetail.css'

// const EventDetail = () => {
//   const { eventId } = useParams()
//   const { getEventById, loading: eventLoading, error: eventError } = useEvents()
//   const {
//     attendees,
//     getAttendees,
//     addAttendees,
//     markAttendance, // Add this function from useAttendees hook
//     loading: attendeesLoading,
//     error: attendeesError,
//   } = useAttendees()

//   const [event, setEvent] = useState(null)
//   const [notification, setNotification] = useState({
//     show: false,
//     message: '',
//     type: '',
//   })

//   const {
//     minting,
//     status,
//     error: mintError,
//     transaction,
//     batchResults,
//     batchMintBadges,
//     getMintStatus,
//     resetMinting,
//   } = useMinting()

//   const [mintingStatus, setMintingStatus] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const eventData = await getEventById(eventId)
//         setEvent(eventData)
//         await getAttendees(eventId)
//         await fetchMintingStatus()
//       } catch (error) {
//         console.error('Error fetching event details:', error)
//         setNotification({
//           show: true,
//           message: 'Failed to load event details',
//           type: 'error',
//         })
//       }
//     }

//     if (eventId) {
//       fetchData()
//     }
//   }, [eventId, getEventById, getAttendees])

//   const fetchMintingStatus = async () => {
//     try {
//       const response = await getMintStatus(eventId)
//       setMintingStatus(response)
//     } catch (error) {
//       console.error('Error fetching minting status:', error)
//     }
//   }

//   const handleMint = async () => {
//     try {
//       await batchMintBadges(eventId)
//       setNotification({
//         show: true,
//         message: 'Minting process started successfully',
//         type: 'success',
//       })
//       // Refresh data after minting
//       await getAttendees(eventId)
//       await fetchMintingStatus()
//     } catch (error) {
//       setNotification({
//         show: true,
//         message: error.message || 'Failed to start minting process',
//         type: 'error',
//       })
//     }
//   }

//   const handleCSVUpload = async (formData) => {
//     try {
//       const response = await addAttendees(formData)

//       if (response.success) {
//         setNotification({
//           show: true,
//           message: `Successfully processed ${response.data.processed} attendees. ${response.data.errors} errors.`,
//           type: 'success',
//         })
//         // Refresh attendees list
//         await getAttendees(eventId)
//       } else {
//         setNotification({
//           show: true,
//           message: response.message || 'Failed to process CSV',
//           type: 'error',
//         })
//       }

//       return response
//     } catch (error) {
//       console.error('CSV upload error:', error)
//       setNotification({
//         show: true,
//         message: error.message || 'Failed to upload CSV file',
//         type: 'error',
//       })
//       throw error
//     }
//   }

//   // Add this function to handle attendance marking
//   const handleMarkAttendance = async (attendeeId, currentStatus) => {
//     try {
//       await markAttendance(attendeeId, currentStatus)
//       setNotification({
//         show: true,
//         message: 'Attendance updated successfully',
//         type: 'success',
//       })
//       // Refresh attendees list to get updated data
//       await getAttendees(eventId)
//     } catch (error) {
//       setNotification({
//         show: true,
//         message: error.message || 'Failed to update attendance',
//         type: 'error',
//       })
//     }
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     })
//   }

//   // Calculate statistics
//   const totalAttendees = attendees.length
//   const attendedCount = attendees.filter((a) => a.hasAttended).length
//   const badgesMinted = attendees.filter((a) => a.hasReceivedBadge).length
//   const eligibleForMinting = attendees.filter(
//     (a) => a.hasAttended && !a.hasReceivedBadge && a.walletAddress
//   ).length

//   if (eventLoading) {
//     return (
//       <div className="event-detail-loading">
//         <Loader size="large" />
//         <p>Loading event details...</p>
//       </div>
//     )
//   }

//   if (eventError || !event) {
//     return (
//       <div className="event-detail-error">
//         <div className="container">
//           <h2>Event Not Found</h2>
//           <p>
//             The event you're looking for doesn't exist or you don't have access
//             to it.
//           </p>
//           <Button as={Link} to="/dashboard" variant="primary">
//             Back to Dashboard
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="event-detail">
//       <div className="container">
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           isVisible={notification.show}
//           onClose={() =>
//             setNotification({ show: false, message: '', type: '' })
//           }
//         />

//         <div className="event-detail-header">
//           <Button as={Link} to="/dashboard" variant="outline" size="small">
//             ← Back to Events
//           </Button>
//           <h1 className="event-detail-title">{event.name}</h1>
//           <p className="event-detail-date">{formatDate(event.date)}</p>
//         </div>

//         <div className="event-detail-content">
//           <div className="event-detail-info">
//             <div className="event-image">
//               <img
//                 src={event.templateImage || event.image || DEFAULTS.EVENT_IMAGE}
//                 alt={event.name}
//                 onError={(e) => {
//                   e.target.src = DEFAULTS.EVENT_IMAGE
//                 }}
//               />
//             </div>

//             <div className="event-stats">
//               <div className="stat-card">
//                 <span className="stat-number">{totalAttendees}</span>
//                 <span className="stat-label">Total Attendees</span>
//               </div>
//               <div className="stat-card">
//                 <span className="stat-number">{attendedCount}</span>
//                 <span className="stat-label">Attended</span>
//               </div>
//               <div className="stat-card">
//                 <span className="stat-number">{badgesMinted}</span>
//                 <span className="stat-label">Badges Minted</span>
//               </div>
//               <div className="stat-card">
//                 <span className="stat-number">{eligibleForMinting}</span>
//                 <span className="stat-label">Ready to Mint</span>
//               </div>

//               {mintingStatus && (
//                 <div className="stat-card mint-stats">
//                   <span className="stat-number">
//                     {mintingStatus.summary?.total || 0}
//                   </span>
//                   <span className="stat-label">Total Transactions</span>
//                   <div className="mint-substats">
//                     <span>✓ {mintingStatus.summary?.completed || 0}</span>
//                     <span>⏳ {mintingStatus.summary?.processing || 0}</span>
//                     <span>✗ {mintingStatus.summary?.failed || 0}</span>
//                   </div>
//                 </div>
//               )}

//               <div className="stat-card mint-action">
//                 <MintButton
//                   onClick={handleMint}
//                   loading={minting}
//                   status={status}
//                   disabled={eligibleForMinting === 0 || minting}
//                 />
//                 <p className="mint-hint">
//                   {eligibleForMinting === 0
//                     ? 'No attendees eligible for minting'
//                     : `${eligibleForMinting} badges ready to mint`}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="event-detail-sections">
//             <CSVUploader
//               onUpload={handleCSVUpload}
//               loading={attendeesLoading}
//               eventId={eventId}
//             />

//             <MintStatus
//               status={status}
//               transaction={transaction}
//               error={mintError}
//             />

//             {batchResults && (
//               <div className="batch-results">
//                 <h3>Batch Minting Results</h3>
//                 <div className="results-summary">
//                   <span>Total: {batchResults.total}</span>
//                   <span className="success">
//                     Successful: {batchResults.successful}
//                   </span>
//                   <span className="error">Failed: {batchResults.failed}</span>
//                 </div>
//                 {batchResults.details && batchResults.details.length > 0 && (
//                   <div className="results-details">
//                     <h4>Details:</h4>
//                     {batchResults.details.slice(0, 5).map((detail, index) => (
//                       <div
//                         key={index}
//                         className={`result-item ${detail.status}`}
//                       >
//                         <span className="attendee-email">
//                           {detail.attendee}
//                         </span>
//                         <span className={`status ${detail.status}`}>
//                           {detail.status === 'success' ? '✓' : '✗'}
//                         </span>
//                         {detail.error && (
//                           <span className="error-message">{detail.error}</span>
//                         )}
//                       </div>
//                     ))}
//                     {batchResults.details.length > 5 && (
//                       <p className="more-results">
//                         ... and {batchResults.details.length - 5} more results
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             <AttendeeList
//               attendees={attendees}
//               loading={attendeesLoading}
//               error={attendeesError}
//               onMarkAttendance={handleMarkAttendance} // Pass the function here
//               onRefresh={() => {
//                 getAttendees(eventId)
//                 fetchMintingStatus()
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EventDetail
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import { useAttendees } from '../../hooks/useAttendees'
import AttendeeList from '../../components/attendees/AttendeeList/AttendeeList'
import CSVUploader from '../../components/attendees/CSVUploader/CSVUploader'
import Button from '../../components/common/Button/Button'
import Loader from '../../components/common/Loader/Loader'
import Notification from '../../components/common/Notification/Notification'
import { DEFAULTS } from '../../utils/constants'
import { useMinting } from '../../hooks/useMinting'
import MintButton from '../../components/minting/MintButton/MintButton'
import MintStatus from '../../components/minting/MintStatus/MintStatus'
import './EventDetail.css'

const EventDetail = () => {
  const { eventId } = useParams()
  const { getEventById, loading: eventLoading, error: eventError } = useEvents()
  const {
    attendees,
    getAttendees,
    addAttendees,
    markAttendance, // Add this function from useAttendees hook
    loading: attendeesLoading,
    error: attendeesError,
  } = useAttendees()

  const [event, setEvent] = useState(null)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  })

  const {
    minting,
    status,
    error: mintError,
    transaction,
    batchResults,
    batchMintBadges,
    getMintStatus,
    resetMinting,
  } = useMinting()

  const [mintingStatus, setMintingStatus] = useState(null)

  // Get the image URL - handle both backend and mock data formats (same as EventCard)
  const getImageUrl = (image) => {
    if (image) {
      // If it's a full URL or relative path from backend
      if (typeof image === 'string') {
        return image.startsWith('http')
          ? image
          : `${
              import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
            }${image}`
      }
    }
    return DEFAULTS.EVENT_IMAGE
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEventById(eventId)
        setEvent(eventData)
        await getAttendees(eventId)
        await fetchMintingStatus()
      } catch (error) {
        console.error('Error fetching event details:', error)
        setNotification({
          show: true,
          message: 'Failed to load event details',
          type: 'error',
        })
      }
    }

    if (eventId) {
      fetchData()
    }
  }, [eventId, getEventById, getAttendees])

  const fetchMintingStatus = async () => {
    try {
      const response = await getMintStatus(eventId)
      setMintingStatus(response)
    } catch (error) {
      console.error('Error fetching minting status:', error)
    }
  }

  const handleMint = async () => {
    try {
      await batchMintBadges(eventId)
      setNotification({
        show: true,
        message: 'Minting process started successfully',
        type: 'success',
      })
      // Refresh data after minting
      await getAttendees(eventId)
      await fetchMintingStatus()
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || 'Failed to start minting process',
        type: 'error',
      })
    }
  }

  const handleCSVUpload = async (formData) => {
    try {
      const response = await addAttendees(formData)

      if (response.success) {
        setNotification({
          show: true,
          message: `Successfully processed ${response.data.processed} attendees. ${response.data.errors} errors.`,
          type: 'success',
        })
        // Refresh attendees list
        await getAttendees(eventId)
      } else {
        setNotification({
          show: true,
          message: response.message || 'Failed to process CSV',
          type: 'error',
        })
      }

      return response
    } catch (error) {
      console.error('CSV upload error:', error)
      setNotification({
        show: true,
        message: error.message || 'Failed to upload CSV file',
        type: 'error',
      })
      throw error
    }
  }

  // Add this function to handle attendance marking
  const handleMarkAttendance = async (attendeeId, currentStatus) => {
    try {
      await markAttendance(attendeeId, currentStatus)
      setNotification({
        show: true,
        message: 'Attendance updated successfully',
        type: 'success',
      })
      // Refresh attendees list to get updated data
      await getAttendees(eventId)
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || 'Failed to update attendance',
        type: 'error',
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Calculate statistics
  const totalAttendees = attendees.length
  const attendedCount = attendees.filter((a) => a.hasAttended).length
  const badgesMinted = attendees.filter((a) => a.hasReceivedBadge).length
  const eligibleForMinting = attendees.filter(
    (a) => a.hasAttended && !a.hasReceivedBadge && a.walletAddress
  ).length

  if (eventLoading) {
    return (
      <div className="event-detail-loading">
        <Loader size="large" />
        <p>Loading event details...</p>
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div className="event-detail-error">
        <div className="container">
          <h2>Event Not Found</h2>
          <p>
            The event you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button as={Link} to="/dashboard" variant="primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="event-detail">
      <div className="container">
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={() =>
            setNotification({ show: false, message: '', type: '' })
          }
        />

        <div className="event-detail-header">
          <Button as={Link} to="/dashboard" variant="outline" size="small">
            ← Back to Events
          </Button>
          <h1 className="event-detail-title">{event.name}</h1>
          <p className="event-detail-date">{formatDate(event.date)}</p>
        </div>

        <div className="event-detail-content">
          <div className="event-detail-info">
            <div className="event-image">
              <img
                src={getImageUrl(event.templateImage || event.image)}
                alt={event.name}
                onError={(e) => {
                  e.target.src = DEFAULTS.EVENT_IMAGE
                }}
              />
            </div>

            <div className="event-stats">
              <div className="stat-card">
                <span className="stat-number">{totalAttendees}</span>
                <span className="stat-label">Total Attendees</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{attendedCount}</span>
                <span className="stat-label">Attended</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{badgesMinted}</span>
                <span className="stat-label">Badges Minted</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{eligibleForMinting}</span>
                <span className="stat-label">Ready to Mint</span>
              </div>

              {mintingStatus && (
                <div className="stat-card mint-stats">
                  <span className="stat-number">
                    {mintingStatus.summary?.total || 0}
                  </span>
                  <span className="stat-label">Total Transactions</span>
                  <div className="mint-substats">
                    <span>✓ {mintingStatus.summary?.completed || 0}</span>
                    <span>⏳ {mintingStatus.summary?.processing || 0}</span>
                    <span>✗ {mintingStatus.summary?.failed || 0}</span>
                  </div>
                </div>
              )}

              <div className="stat-card mint-action">
                <MintButton
                  onClick={handleMint}
                  loading={minting}
                  status={status}
                  disabled={eligibleForMinting === 0 || minting}
                />
                <p className="mint-hint">
                  {eligibleForMinting === 0
                    ? 'No attendees eligible for minting'
                    : `${eligibleForMinting} badges ready to mint`}
                </p>
              </div>
            </div>
          </div>

          <div className="event-detail-sections">
            <CSVUploader
              onUpload={handleCSVUpload}
              loading={attendeesLoading}
              eventId={eventId}
            />

            <MintStatus
              status={status}
              transaction={transaction}
              error={mintError}
            />

            {batchResults && (
              <div className="batch-results">
                <h3>Batch Minting Results</h3>
                <div className="results-summary">
                  <span>Total: {batchResults.total}</span>
                  <span className="success">
                    Successful: {batchResults.successful}
                  </span>
                  <span className="error">Failed: {batchResults.failed}</span>
                </div>
                {batchResults.details && batchResults.details.length > 0 && (
                  <div className="results-details">
                    <h4>Details:</h4>
                    {batchResults.details.slice(0, 5).map((detail, index) => (
                      <div
                        key={index}
                        className={`result-item ${detail.status}`}
                      >
                        <span className="attendee-email">
                          {detail.attendee}
                        </span>
                        <span className={`status ${detail.status}`}>
                          {detail.status === 'success' ? '✓' : '✗'}
                        </span>
                        {detail.error && (
                          <span className="error-message">{detail.error}</span>
                        )}
                      </div>
                    ))}
                    {batchResults.details.length > 5 && (
                      <p className="more-results">
                        ... and {batchResults.details.length - 5} more results
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <AttendeeList
              attendees={attendees}
              loading={attendeesLoading}
              error={attendeesError}
              onMarkAttendance={handleMarkAttendance} // Pass the function here
              onRefresh={() => {
                getAttendees(eventId)
                fetchMintingStatus()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
