import { ERROR_MESSAGES } from './error-messages-constants'

interface ErrorPattern {
  patterns: string[]
  message: string
}

const ERROR_PATTERNS: ErrorPattern[] = [
  { patterns: ['failed to fetch', 'network error'], message: ERROR_MESSAGES.NETWORK_CONNECTION },
  {
    patterns: ['connection closed', 'connection refused'],
    message: ERROR_MESSAGES.CONNECTION_LOST,
  },
  { patterns: ['timeout'], message: ERROR_MESSAGES.TIMEOUT },
  { patterns: ['404'], message: ERROR_MESSAGES.NOT_FOUND },
  { patterns: ['500', '503'], message: ERROR_MESSAGES.SERVER_UNAVAILABLE },
  { patterns: ['429'], message: ERROR_MESSAGES.TOO_MANY_REQUESTS },
  { patterns: ['http error', 'status:'], message: ERROR_MESSAGES.SERVER_ERROR },
  { patterns: ['fetch', 'load'], message: ERROR_MESSAGES.LOAD_FAILED },
]

const extractMessage = (error: unknown): string | null => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: unknown }).message
    return typeof msg === 'string' ? msg : null
  }
  try {
    return String(error)
  } catch {
    return null
  }
}

const matchesPattern = (message: string, { patterns }: ErrorPattern): boolean =>
  patterns.some(p => message.includes(p))

export const getErrorMessage = (error: unknown): string => {
  if (!error) return ERROR_MESSAGES.UNEXPECTED

  const message = extractMessage(error)
  if (!message) return ERROR_MESSAGES.DEFAULT

  const lowerMessage = message.toLowerCase()
  const matched = ERROR_PATTERNS.find(pattern => matchesPattern(lowerMessage, pattern))

  return matched?.message || ERROR_MESSAGES.DEFAULT
}
