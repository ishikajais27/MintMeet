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

  // Get event by ID - FIXED
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
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await eventService.deleteEvent(eventId)
      setLoading(false)
      return response.data
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete event'
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
    deleteEvent,
  }
}
