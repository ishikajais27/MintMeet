import { useState, useCallback } from 'react'
import { attendeeService } from '../services/attendeeService'

export const useAttendees = () => {
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get attendees for an event
  const getAttendees = useCallback(async (eventId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.getAttendees(eventId)
      if (response.success) {
        setAttendees(response.data || [])
      } else {
        setError(response.message || 'Failed to fetch attendees')
      }
      setLoading(false)
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch attendees'
      setError(errorMsg)
      setLoading(false)
      throw new Error(errorMsg)
    }
  }, [])

  // Add attendees via CSV
  // const addAttendees = useCallback(async (formData) => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const response = await attendeeService.addAttendees(formData)
  //     setLoading(false)
  //     return response
  //   } catch (err) {
  //     const errorMsg =
  //       err.response?.data?.message || err.message || 'Failed to add attendees'
  //     setError(errorMsg)
  //     setLoading(false)
  //     throw new Error(errorMsg)
  //   }
  // }, [])
  // In useAttendees.js - Update addAttendees function
  const addAttendees = useCallback(async (formData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.addAttendees(formData)

      if (response && response.success) {
        setLoading(false)
        return response
      } else {
        const errorMsg = response?.message || 'Failed to process CSV'
        setError(errorMsg)
        setLoading(false)
        throw new Error(errorMsg)
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to add attendees'
      setError(errorMsg)
      setLoading(false)
      throw new Error(errorMsg)
    }
  }, [])

  // Register single attendee
  const registerAttendee = useCallback(async (attendeeData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.registerAttendee(attendeeData)
      setLoading(false)
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to register attendee'
      setError(errorMsg)
      setLoading(false)
      throw new Error(errorMsg)
    }
  }, [])

  // Mark attendance
  // const markAttendance = useCallback(async (attendeeId) => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const response = await attendeeService.markAttendance(attendeeId)
  //     setLoading(false)
  //     return response
  //   } catch (err) {
  //     const errorMsg =
  //       err.response?.data?.message ||
  //       err.message ||
  //       'Failed to mark attendance'
  //     setError(errorMsg)
  //     setLoading(false)
  //     throw new Error(errorMsg)
  //   }
  // }, [])
  const markAttendance = useCallback(async (attendeeId, currentStatus) => {
    try {
      setLoading(true)
      const response = await attendeeService.markAttendance(
        attendeeId,
        currentStatus
      )

      // Update local state
      setAttendees((prev) =>
        prev.map((attendee) =>
          attendee._id === attendeeId
            ? { ...attendee, hasAttended: !currentStatus }
            : attendee
        )
      )

      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }, [])

  // Update attendee
  const updateAttendee = useCallback(async (attendeeId, attendeeData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.updateAttendee(
        attendeeId,
        attendeeData
      )
      setLoading(false)
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to update attendee'
      setError(errorMsg)
      setLoading(false)
      throw new Error(errorMsg)
    }
  }, [])

  // Delete attendee
  const deleteAttendee = useCallback(async (attendeeId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.deleteAttendee(attendeeId)
      setLoading(false)
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete attendee'
      setError(errorMsg)
      setLoading(false)
      throw new Error(errorMsg)
    }
  }, [])

  return {
    attendees,
    loading,
    error,
    getAttendees,
    addAttendees,
    registerAttendee,
    markAttendance,
    updateAttendee,
    deleteAttendee,
  }
}
