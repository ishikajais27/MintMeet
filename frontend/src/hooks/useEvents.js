// import { useState, useCallback } from 'react'
// import { eventService } from '../services/eventService'

// export const useEvents = () => {
//   const [events, setEvents] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // Create a new event
//   const createEvent = useCallback(async (eventData) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await eventService.createEvent(eventData)
//       setEvents((prev) => [...prev, response.data])
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to create event')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   // Fetch all events
//   const fetchEvents = useCallback(async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await eventService.getAllEvents()
//       setEvents(response.data || [])
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to fetch events')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   // Get event by ID
//   const getEventById = useCallback(async (id) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await eventService.getEventById(id)
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to fetch event')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   // Update event
//   const updateEvent = useCallback(async (id, eventData) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await eventService.updateEvent(id, eventData)
//       // Update the event in the local state
//       setEvents((prev) =>
//         prev.map((event) => (event._id === id ? response.data : event))
//       )
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to update event')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   // Upload event image
//   const uploadEventImage = useCallback(async (eventId, imageFile) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await eventService.uploadEventImage(eventId, imageFile)
//       setLoading(false)
//       return response.data
//     } catch (err) {
//       setError(err.message || 'Failed to upload image')
//       setLoading(false)
//       throw err
//     }
//   }, [])

//   return {
//     events,
//     loading,
//     error,
//     createEvent,
//     fetchEvents,
//     getEventById,
//     updateEvent,
//     uploadEventImage,
//   }
// }
import { useState, useCallback } from 'react'
import { eventService } from '../services/eventService'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create a new event
  const createEvent = useCallback(async (eventData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await eventService.createEvent(eventData)
      setEvents((prev) => [...prev, response.data])
      setLoading(false)
      return response.data
    } catch (err) {
      const errorMessage = err.message || 'Failed to create event'
      setError(errorMessage)
      setLoading(false)
      throw new Error(errorMessage)
    }
  }, [])

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await eventService.getAllEvents()
      setEvents(response.data || [])
      setLoading(false)
      return response.data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch events'
      setError(errorMessage)
      setLoading(false)
      throw new Error(errorMessage)
    }
  }, [])

  // Get event by ID
  const getEventById = useCallback(async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await eventService.getEventById(id)
      setLoading(false)
      return response.data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch event'
      setError(errorMessage)
      setLoading(false)
      throw new Error(errorMessage)
    }
  }, [])

  return {
    events,
    loading,
    error,
    createEvent,
    fetchEvents,
    getEventById,
  }
}
