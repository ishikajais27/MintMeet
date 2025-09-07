// API Configuration

export const API_BASE_URL = 'http://localhost:5000'

// Minting Statuses
export const MINT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
}

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CREATE_EVENT: '/create-event',
  EVENT_DETAIL: '/event/:id',
}

// Local Storage Keys
export const LS_KEYS = {
  EVENTS: 'eventproof_events',
}

// Default values
export const DEFAULTS = {
  EVENT_IMAGE: '/placeholder-event.jpg',
}
