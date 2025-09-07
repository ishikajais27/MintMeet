import api from './api'

export const eventService = {
  // Create a new event
  createEvent: async (formData) => {
    //   try {
    //     // Format the date to ISO string
    //     const formattedData = {
    //       name: eventData.name,
    //       organizer: eventData.organizer,
    //       date: new Date(eventData.date).toISOString(),
    //       description: eventData.description || '',
    //     }

    //     const response = await api.post('/api/events', formattedData)

    //     // If there's an image, upload it separately
    //     if (eventData.image) {
    //       await eventService.uploadEventImage(
    //         response.data.data._id,
    //         eventData.image
    //       )
    //       // Refetch the event to get the updated data with image
    //       const updatedEvent = await eventService.getEventById(
    //         response.data.data._id
    //       )
    //       return { data: updatedEvent.data }
    //     }

    //     return response.data
    //   } catch (error) {
    //     console.error('Error creating event:', error)

    //     if (error.response?.data?.message) {
    //       throw new Error(error.response.data.message)
    //     }

    //     throw new Error('Failed to create event. Please try again.')
    //   }
    // },
    try {
      const response = await api.post('/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw new Error(
        error.response?.data?.message ||
          'Failed to create event. Please try again.'
      )
    }
  },
  // In eventService.js
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/api/events/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw new Error(
        error.response?.data?.message ||
          'Failed to delete event. Please try again.'
      )
    }
  },
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await api.get('/api/events')
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch events. Please try again.')
    }
  },

  // Get single event by ID - FIXED
  getEventById: async (id) => {
    try {
      const response = await api.get(`/api/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)

      if (error.response?.status === 404) {
        throw new Error('Event not found')
      }

      if (error.response?.status === 400) {
        throw new Error('Invalid event ID format')
      }

      throw new Error('Failed to fetch event. Please try again.')
    }
  },

  // Upload event image
  uploadEventImage: async (eventId, imageFile) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post(
        `/api/events/${eventId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error uploading event image:', error)
      throw new Error('Failed to upload image. Please try again.')
    }
  },
}
