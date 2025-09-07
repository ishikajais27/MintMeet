// // import api from './api'

// // export const mintService = {
// //   // Mint badge for a specific attendee
// //   mintBadgeForAttendee: async (attendeeId) => {
// //     try {
// //       const response = await api.post(`/api/mint/attendee/${attendeeId}`)
// //       return response.data
// //     } catch (error) {
// //       console.error('Error minting badge for attendee:', error)
// //       throw error
// //     }
// //   },

// //   // Batch mint badges for an event
// //   batchMintBadges: async (eventId) => {
// //     try {
// //       const response = await api.post(`/api/mint/batch/${eventId}`)
// //       return response.data
// //     } catch (error) {
// //       console.error('Error batch minting badges:', error)
// //       throw error
// //     }
// //   },

// //   // Get minting status for an event
// //   getMintStatus: async (eventId) => {
// //     try {
// //       const response = await api.get(`/api/mint/status/${eventId}`)
// //       return response.data
// //     } catch (error) {
// //       console.error('Error getting mint status:', error)
// //       throw error
// //     }
// //   },
// // }
// import api from './api'

// export const mintService = {
//   // Mint badge for a specific attendee
//   mintBadgeForAttendee: async (attendeeId) => {
//     try {
//       const response = await api.post(`/api/mint/attendee/${attendeeId}`)
//       return response.data
//     } catch (error) {
//       console.error('Error minting badge for attendee:', error)
//       throw new Error(error.response?.data?.message || 'Failed to mint badge')
//     }
//   },

//   // Batch mint badges for an event
//   batchMintBadges: async (eventId) => {
//     try {
//       const response = await api.post(`/api/mint/batch/${eventId}`)
//       return response.data
//     } catch (error) {
//       console.error('Error batch minting badges:', error)
//       throw new Error(
//         error.response?.data?.message || 'Failed to batch mint badges'
//       )
//     }
//   },

//   // Get minting status for an event
//   getMintStatus: async (eventId) => {
//     try {
//       const response = await api.get(`/api/mint/status/${eventId}`)
//       return response.data
//     } catch (error) {
//       console.error('Error getting mint status:', error)
//       throw new Error(
//         error.response?.data?.message || 'Failed to get mint status'
//       )
//     }
//   },
// }
import api from './api'

export const mintService = {
  // Mint badge for a specific attendee
  mintBadgeForAttendee: async (attendeeId) => {
    try {
      const response = await api.post(`/api/mint/attendee/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error minting badge for attendee:', error)
      throw error.response?.data || error
    }
  },

  // Batch mint badges for an event
  batchMintBadges: async (eventId) => {
    try {
      const response = await api.post(`/api/mint/batch/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error batch minting badges:', error)
      throw error.response?.data || error
    }
  },

  // Get minting status for an event
  getMintStatus: async (eventId) => {
    try {
      const response = await api.get(`/api/mint/status/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error getting mint status:', error)
      throw error.response?.data || error
    }
  },
}
