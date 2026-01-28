export const MIN_YEAR = 1960
export const MAX_YEAR = new Date().getFullYear()

export const PRESET_IDS = {
  LAST_5_YEARS: 'last-5-years',
  LAST_10_YEARS: 'last-10-years',
  LAST_15_YEARS: 'last-15-years',
  CUSTOM: 'custom',
} as const

export const DEFAULT_PRESET_ID = PRESET_IDS.LAST_5_YEARS

const getCurrentYear = () => new Date().getFullYear()

const createPeriodPresets = (): PeriodPreset[] => [
  {
    id: PRESET_IDS.LAST_5_YEARS,
    label: 'Last 5 years',
    startYear: getCurrentYear() - 5,
    endYear: getCurrentYear(),
  },
  {
    id: PRESET_IDS.LAST_10_YEARS,
    label: 'Last 10 years',
    startYear: getCurrentYear() - 10,
    endYear: getCurrentYear(),
  },
  {
    id: PRESET_IDS.LAST_15_YEARS,
    label: 'Last 15 years',
    startYear: getCurrentYear() - 15,
    endYear: getCurrentYear(),
  },
]

export const PERIOD_PRESETS: PeriodPreset[] = createPeriodPresets()

export const DEFAULT_FILTERS = {
  countries: [],
  indicators: ['NY.GDP.MKTP.CD'],
  startYear: new Date().getFullYear() - 5,
  endYear: new Date().getFullYear(),
}

export const MAX_COUNTRIES = 3

export const STALE_TIME_ONE_HOUR = 1000 * 60 * 60
export const STALE_TIME_FIVE_MINUTES = 1000 * 60 * 5

export const API_PER_PAGE_COUNTRIES = 300
export const API_PER_PAGE_DATA = 10000
export const MAX_COUNTRIES_PER_REQUEST = 10
export const API_REQUEST_TIMEOUT = 30000

export const NUMBER_FORMAT_RULES = [
  { threshold: 1e9, suffix: 'B' },
  { threshold: 1e6, suffix: 'M' },
  { threshold: 1e3, suffix: 'K' },
]
