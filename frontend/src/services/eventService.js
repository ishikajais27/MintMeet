// import api from './api'

// export const eventService = {
//   // Create a new event
//   createEvent: async (eventData) => {
//     try {
//       // Extract the image file from the event data
//       const { image, ...eventDataWithoutImage } = eventData

//       // First create the event
//       const response = await api.post('/api/events', eventDataWithoutImage)

//       // If there's an image, upload it separately
//       if (image) {
//         await eventService.uploadEventImage(response.data.data._id, image)
//         // Refetch the event to get the updated data with image
//         const updatedEvent = await eventService.getEventById(
//           response.data.data._id
//         )
//         return { data: updatedEvent.data }
//       }

//       return response.data
//     } catch (error) {
//       console.error('Error creating event:', error)

//       // Provide better error messages
//       if (error.response?.data?.errors) {
//         const errorMessages = Object.values(error.response.data.errors)
//           .map((err) => err.message || err)
//           .join(', ')
//         throw new Error(errorMessages)
//       }

//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message)
//       }

//       throw new Error('Failed to create event. Please try again.')
//     }
//   },

//   // Get all events
//   getAllEvents: async () => {
//     try {
//       const response = await api.get('/api/events')
//       return response.data
//     } catch (error) {
//       console.error('Error fetching events:', error)
//       throw new Error('Failed to fetch events. Please try again.')
//     }
//   },

//   // Get single event by ID
//   getEventById: async (id) => {
//     try {
//       const response = await api.get(`/api/events/${id}`)
//       return response.data
//     } catch (error) {
//       console.error('Error fetching event:', error)

//       if (error.response?.status === 404) {
//         throw new Error('Event not found')
//       }

//       throw new Error('Failed to fetch event. Please try again.')
//     }
//   },

//   // Upload event image
//   uploadEventImage: async (eventId, imageFile) => {
//     try {
//       const formData = new FormData()
//       formData.append('image', imageFile)

//       const response = await api.post(
//         `/api/events/${eventId}/image`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       )
//       return response.data
//     } catch (error) {
//       console.error('Error uploading event image:', error)
//       throw new Error('Failed to upload image. Please try again.')
//     }
//   },
// }
import api from './api'

export const eventService = {
  // Create a new event
  createEvent: async (eventData) => {
    try {
      // Extract the image file from the event data
      const { image, ...eventDataWithoutImage } = eventData

      // First create the event
      const response = await api.post('/api/events', eventDataWithoutImage)

      // If there's an image, upload it separately
      if (image) {
        try {
          await eventService.uploadEventImage(response.data.data._id, image)
          // Refetch the event to get the updated data with image
          const updatedEvent = await eventService.getEventById(
            response.data.data._id
          )
          return { data: updatedEvent.data }
        } catch (uploadError) {
          console.error(
            'Image upload failed, but event was created:',
            uploadError
          )
          // Still return the event even if image upload fails
          return response.data
        }
      }

      return response.data
    } catch (error) {
      console.error('Error creating event:', error)

      // Provide better error messages
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .map((err) => err.message || err)
          .join(', ')
        throw new Error(errorMessages)
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      throw new Error('Failed to create event. Please try again.')
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

  // Get single event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/api/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)

      if (error.response?.status === 404) {
        throw new Error('Event not found')
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
