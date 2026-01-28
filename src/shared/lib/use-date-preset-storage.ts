import { findPresetById } from '@/entities/date-range'
import { DEFAULT_PRESET_ID } from './constants'
import { handleStorageError } from './storage-error-handler'

const STORAGE_KEY = 'dashboard-date-preset'

export const loadDatePreset = (): string => {
  if (!process.client) return DEFAULT_PRESET_ID

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const presetId = JSON.parse(stored)
      if (findPresetById(presetId)) {
        return presetId
      }
    }
  } catch (error) {
    handleStorageError(error, STORAGE_KEY)
  }

  return DEFAULT_PRESET_ID
}

export const saveDatePreset = (presetId: string): void => {
  if (!process.client) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presetId))
  } catch (error) {
    handleStorageError(error, STORAGE_KEY)
  }
}
