import api from './api'

export const attendeeService = {
  // Get attendees for an event
  getAttendees: async (eventId) => {
    try {
      const response = await api.get(`/api/attendees/event/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendees:', error)
      // Enhanced error handling
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to fetch attendees'
        )
      }
      throw error
    }
  },

  // Register single attendee
  registerAttendee: async (attendeeData) => {
    try {
      const response = await api.post('/api/attendees', attendeeData)
      return response.data
    } catch (error) {
      console.error('Error registering attendee:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to register attendee'
        )
      }
      throw error
    }
  },

  // Add attendees via CSV
  // addAttendees: async (formData) => {
  //   try {
  //     const response = await api.post('/api/attendees/csv-upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       timeout: 30000, // 30 second timeout for large files
  //     })
  //     return response.data
  //   } catch (error) {
  //     console.error('Error adding attendees via CSV:', error)
  //     if (error.response?.data) {
  //       throw new Error(error.response.data.message || 'Failed to upload CSV')
  //     }
  //     throw error
  //   }
  // },
  // In attendeeService.js - completely replace addAttendees function
  addAttendees: async (formData) => {
    try {
      console.log('Sending CSV upload request...')
      const response = await api.post('/api/attendees/csv-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      })

      console.log('CSV upload response:', response.data)
      return response.data
    } catch (error) {
      console.error('Detailed CSV upload error:', error)

      // Get detailed error information
      const errorData = error.response?.data
      const status = error.response?.status
      const statusText = error.response?.statusText

      let errorMessage = 'Failed to process CSV file'

      if (errorData) {
        if (typeof errorData === 'object') {
          errorMessage =
            errorData.message || errorData.error || JSON.stringify(errorData)
        } else {
          errorMessage = errorData
        }
      } else if (status) {
        errorMessage = `Server error: ${status} ${statusText}`
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try a smaller file.'
      } else if (error.message) {
        errorMessage = error.message
      }

      console.error('Error message:', errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Mark attendance
  // markAttendance: async (attendeeId) => {
  //   try {
  //     const response = await api.patch(
  //       `/api/attendees/${attendeeId}/attendance`
  //     )
  //     return response.data
  //   } catch (error) {
  //     console.error('Error marking attendance:', error)
  //     if (error.response?.data) {
  //       throw new Error(
  //         error.response.data.message || 'Failed to mark attendance'
  //       )
  //     }
  //     throw error
  //   }
  // },
  // Mark attendance (toggle)
  markAttendance: async (attendeeId, currentStatus) => {
    try {
      const response = await api.patch(
        `/api/attendees/${attendeeId}/attendance/toggle`,
        { currentStatus }
      )
      return response.data
    } catch (error) {
      console.error('Error marking attendance:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to mark attendance'
        )
      }
      throw error
    }
  },

  // Export attendees to CSV
  exportAttendees: async (eventId) => {
    try {
      const response = await api.get(`/api/attendees/export/${eventId}`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error exporting attendees:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to export attendees'
        )
      }
      throw error
    }
  },

  // Get attendee by ID
  getAttendee: async (attendeeId) => {
    try {
      const response = await api.get(`/api/attendees/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendee:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to fetch attendee'
        )
      }
      throw error
    }
  },

  // Update attendee
  updateAttendee: async (attendeeId, attendeeData) => {
    try {
      const response = await api.put(
        `/api/attendees/${attendeeId}`,
        attendeeData
      )
      return response.data
    } catch (error) {
      console.error('Error updating attendee:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to update attendee'
        )
      }
      throw error
    }
  },

  // Delete attendee
  deleteAttendee: async (attendeeId) => {
    try {
      const response = await api.delete(`/api/attendees/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting attendee:', error)
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to delete attendee'
        )
      }
      throw error
    }
  },
}
