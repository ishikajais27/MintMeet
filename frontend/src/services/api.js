// import axios from 'axios'
// import { API_BASE_URL } from '../utils/constants'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // You can add auth tokens here if needed
//     console.log('API Request:', config)
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log('API Response:', response)
//     return response
//   },
//   (error) => {
//     console.error('API Error:', error)
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
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    console.log('API Request:', config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response)
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default api
