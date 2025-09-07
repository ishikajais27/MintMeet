// import axios from 'axios'
// import { API_BASE_URL } from '../utils/constants'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10 second timeout
// })

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     console.log('API Request:', config.method?.toUpperCase(), config.url)
//     return config
//   },
//   (error) => {
//     console.error('API Request Error:', error)
//     return Promise.reject(error)
//   }
// )

// // Response interceptor - FIXED error handling
// api.interceptors.response.use(
//   (response) => {
//     console.log('API Response:', response.status, response.config.url)
//     return response
//   },
//   (error) => {
//     console.error('API Error:', error)

//     // Enhanced error information
//     const errorInfo = {
//       message: error.message,
//       code: error.code,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       url: error.config?.url,
//       method: error.config?.method,
//     }

//     console.error('API Error Details:', errorInfo)

//     // Provide better error messages
//     if (error.code === 'ECONNREFUSED') {
//       error.message =
//         'Cannot connect to server. Please check if the backend is running.'
//     } else if (error.code === 'NETWORK_ERROR') {
//       error.message = 'Network error. Please check your internet connection.'
//     } else if (error.code === 'ERR_NETWORK') {
//       error.message =
//         'Network error. Please check your connection and try again.'
//     } else if (error.response?.status === 404) {
//       error.message = 'Resource not found.'
//     } else if (error.response?.status === 500) {
//       error.message = 'Server error. Please try again later.'
//     } else if (error.response?.data?.message) {
//       error.message = error.response.data.message
//     }

//     return Promise.reject(error)
//   }
// )

// export default api
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - FIXED error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Error:', error)

    // Enhanced error information
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    }

    console.error('API Error Details:', errorInfo)

    // Provide better error messages
    if (error.code === 'ECONNREFUSED') {
      error.message =
        'Cannot connect to server. Please check if the backend is running.'
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your internet connection.'
    } else if (error.code === 'ERR_NETWORK') {
      error.message =
        'Network error. Please check your connection and try again.'
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found.'
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.'
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message
    }

    return Promise.reject(error)
  }
)

export default api
