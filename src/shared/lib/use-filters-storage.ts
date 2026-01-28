import { DEFAULT_FILTERS } from './constants'
import { handleStorageError } from './storage-error-handler'

const STORAGE_KEY = 'dashboard-filters'

export interface Filters {
  countries: string[]
  indicators: string[]
  startYear: number
  endYear: number
}

const parseFilters = (json: string): Filters | null => {
  try {
    const parsed = JSON.parse(json)
    return {
      countries: parsed.countries || DEFAULT_FILTERS.countries,
      indicators: parsed.indicators || DEFAULT_FILTERS.indicators,
      startYear: parsed.startYear || DEFAULT_FILTERS.startYear,
      endYear: parsed.endYear || DEFAULT_FILTERS.endYear,
    }
  } catch {
    return null
  }
}

const loadFilters = (): Filters => {
  if (!process.client) return { ...DEFAULT_FILTERS }

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseFilters(stored) || { ...DEFAULT_FILTERS } : { ...DEFAULT_FILTERS }
}

const saveFilters = (filters: Filters): void => {
  if (!process.client) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch (error) {
    handleStorageError(error, STORAGE_KEY)
  }
}

export const useFiltersStorage = () => {
  const filters = ref<Filters>(loadFilters())

  watch(filters, () => saveFilters(filters.value), { deep: true })

  return { filters }
}
