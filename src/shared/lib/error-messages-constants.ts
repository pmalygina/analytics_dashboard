export const ERROR_MESSAGES = {
  UNEXPECTED: 'An unexpected error occurred',
  NETWORK_CONNECTION:
    'Unable to connect to the server. Please check your internet connection and try again.',
  CONNECTION_LOST: 'Connection to the server was lost. Please try again.',
  NOT_FOUND:
    'The requested data was not found. Please try selecting different countries or date range.',
  SERVER_UNAVAILABLE: 'The server is temporarily unavailable. Please try again later.',
  TOO_MANY_REQUESTS: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Unable to load data from the server. Please try again later.',
  TIMEOUT: 'The request took too long. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please try again.',
  DEFAULT: 'An error occurred. Please try again.',
} as const
