const ERROR_TYPES = {
  QUOTA_EXCEEDED: 'quota_exceeded',
  SECURITY: 'security',
  UNKNOWN: 'unknown',
} as const

const DOM_ERROR_NAMES = {
  QUOTA_EXCEEDED: 'QuotaExceededError',
  SECURITY: 'SecurityError',
} as const

const LOG_PREFIX = '[Storage Error]'

type StorageErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES]

interface StorageError {
  type: StorageErrorType
  message: string
  key: string
}

const getStorageErrorType = (error: unknown): StorageErrorType => {
  if (error instanceof DOMException) {
    if (error.name === DOM_ERROR_NAMES.QUOTA_EXCEEDED) return ERROR_TYPES.QUOTA_EXCEEDED
    if (error.name === DOM_ERROR_NAMES.SECURITY) return ERROR_TYPES.SECURITY
  }
  return ERROR_TYPES.UNKNOWN
}

const logStorageError = (error: StorageError): void => {
  if (process.dev) {
    console.warn(`${LOG_PREFIX} ${error.type}: ${error.message}`, { key: error.key })
  }
}

export const handleStorageError = (error: unknown, key: string): void => {
  const errorType = getStorageErrorType(error)
  const message = error instanceof Error ? error.message : String(error)

  logStorageError({
    type: errorType,
    message,
    key,
  })
}
