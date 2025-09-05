import React, { useEffect } from 'react'
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
    loading: attendeesLoading,
    error: attendeesError,
  } = useAttendees()

  const [event, setEvent] = React.useState(null)
  const [notification, setNotification] = React.useState({
    show: false,
    message: '',
    type: '',
  })
  const {
    minting,
    status,
    error: mintError,
    transaction,
    mintBadges,
  } = useMinting()

  const handleMint = async () => {
    try {
      await mintBadges(eventId)
      setNotification({
        show: true,
        message: 'Minting process started successfully',
        type: 'success',
      })
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to start minting process',
        type: 'error',
      })
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEventById(eventId)
        setEvent(eventData)
        await getAttendees(eventId)
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

  const handleCSVUpload = async (attendeesData) => {
    try {
      await addAttendees(eventId, attendeesData)
      setNotification({
        show: true,
        message: `Successfully added ${attendeesData.length} attendees`,
        type: 'success',
      })
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to upload attendees',
        type: 'error',
      })
      throw error
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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
                src={event.image || DEFAULTS.EVENT_IMAGE}
                alt={event.name}
                onError={(e) => {
                  e.target.src = DEFAULTS.EVENT_IMAGE
                }}
              />
            </div>

            <div className="event-stats">
              <div className="stat-card">
                <span className="stat-number">{attendees.length}</span>
                <span className="stat-label">Registered Attendees</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">
                  {attendees.filter((a) => a.status === 'minted').length}
                </span>
                <span className="stat-label">Badges Minted</span>
              </div>
              <div className="stat-card">
                <MintButton
                  onClick={handleMint}
                  loading={minting}
                  status={status}
                  disabled={attendees.length === 0}
                />
              </div>
            </div>
          </div>

          <div className="event-detail-sections">
            <CSVUploader
              onUpload={handleCSVUpload}
              loading={attendeesLoading}
            />
            <MintStatus
              status={status}
              transaction={transaction}
              error={mintError}
            />
            <AttendeeList
              attendees={attendees}
              loading={attendeesLoading}
              error={attendeesError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
