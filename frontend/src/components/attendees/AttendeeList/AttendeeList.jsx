import React from 'react'
import Loader from '../../common/Loader/Loader'
import './AttendeeList.css'

const AttendeeList = ({ attendees, loading, error }) => {
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
              <th>Name</th>
              <th>Email</th>
              <th>Wallet Address</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee._id} className="attendee-row">
                <td className="attendee-name">{attendee.name}</td>
                <td className="attendee-email">{attendee.email}</td>
                <td className="attendee-wallet" title={attendee.walletAddress}>
                  {shortenAddress(attendee.walletAddress)}
                </td>
                <td className="attendee-status">
                  <span className={`status-badge status-${attendee.status}`}>
                    {attendee.status}
                  </span>
                </td>
                <td className="attendee-date">
                  {formatDate(attendee.registeredAt)}
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
