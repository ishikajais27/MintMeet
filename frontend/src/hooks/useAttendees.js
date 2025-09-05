// import { useState, useCallback } from 'react'
// import { attendeeService } from '../services/attendeeService'

// export const useAttendees = () => {
//   const [attendees, setAttendees] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // Get attendees for an event
//   const getAttendees = useCallback(async (eventId) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await attendeeService.getAttendees(eventId)
//       setAttendees(response.data)
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to fetch attendees')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   // Add attendees via CSV
//   const addAttendees = useCallback(
//     async (eventId, attendeesData) => {
//       setLoading(true)
//       setError(null)

//       try {
//         const response = await attendeeService.addAttendees(
//           eventId,
//           attendeesData
//         )
//         // Refresh attendees list after adding
//         await getAttendees(eventId)
//         setLoading(false)
//         return response.data
//       } catch (err) {
//         setError(err.message || 'Failed to add attendees')
//         setLoading(false)
//         throw err
//       }
//     },
//     [getAttendees]
//   )

//   return {
//     attendees,
//     loading,
//     error,
//     getAttendees,
//     addAttendees,
//   }
// }
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
      setAttendees(response.data || [])
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'Failed to fetch attendees')
      setLoading(false)
      throw err
    }
  }, [])

  // Add attendees via CSV
  const addAttendees = useCallback(async (csvFile) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.addAttendees(csvFile)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'Failed to add attendees')
      setLoading(false)
      throw err
    }
  }, [])

  // Register single attendee
  const registerAttendee = useCallback(async (attendeeData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await attendeeService.registerAttendee(attendeeData)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'Failed to register attendee')
      setLoading(false)
      throw err
    }
  }, [])

  // Mark attendance
  const markAttendance = useCallback(
    async (attendeeId) => {
      setLoading(true)
      setError(null)

      try {
        const response = await attendeeService.markAttendance(attendeeId)
        // Refresh attendees list
        if (response.data && response.data.eventId) {
          await getAttendees(response.data.eventId)
        }
        setLoading(false)
        return response.data
      } catch (err) {
        setError(err.message || 'Failed to mark attendance')
        setLoading(false)
        throw err
      }
    },
    [getAttendees]
  )

  return {
    attendees,
    loading,
    error,
    getAttendees,
    addAttendees,
    registerAttendee,
    markAttendance,
  }
}
