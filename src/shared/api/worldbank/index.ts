import {
  API_PER_PAGE_COUNTRIES,
  API_PER_PAGE_DATA,
  MAX_COUNTRIES_PER_REQUEST,
  API_REQUEST_TIMEOUT,
} from '@/shared/lib/constants'

const API_BASE = 'https://api.worldbank.org/v2'

const fetchWithTimeout = async <T>(url: string): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch (e) {
    clearTimeout(timeoutId)
    throw e instanceof Error && e.name === 'AbortError' ? new Error('Request timeout') : e
  }
}

const isValidCountry = (country: Country): boolean => Boolean(country.id && country.region?.id)

const filterValidCodes = (codes: string[]): string[] => codes.filter(c => c?.trim())

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

const extractSuccessfulResults = <T>(results: PromiseSettledResult<T>[]): T[] =>
  results.filter((r): r is PromiseFulfilledResult<T> => r.status === 'fulfilled').map(r => r.value)

const buildDataUrl = (
  countries: string[],
  indicators: string[],
  startYear: number,
  endYear: number
): string =>
  `${API_BASE}/country/${countries.join(';')}/indicator/${indicators.join(';')}?format=json&date=${startYear}:${endYear}&per_page=${API_PER_PAGE_DATA}`

const fetchDataBatch = async (
  countries: string[],
  indicators: string[],
  startYear: number,
  endYear: number
): Promise<WorldBankDataPoint[]> => {
  const url = buildDataUrl(countries, indicators, startYear, endYear)
  const data = await fetchWithTimeout<WorldBankApiResponse>(url)
  return Array.isArray(data) && data[1] ? data[1] : []
}

export const fetchCountries = async (): Promise<Country[]> => {
  const url = `${API_BASE}/country?format=json&per_page=${API_PER_PAGE_COUNTRIES}`
  const data = await fetchWithTimeout<[unknown, Country[]]>(url)
  return (data[1] || []).filter(isValidCountry)
}

export const fetchWorldBankData = async (
  countries: string[],
  indicators: string[],
  startYear: number,
  endYear: number
): Promise<WorldBankDataPoint[]> => {
  const codes = filterValidCodes(countries)
  if (!codes.length) return []

  if (codes.length <= MAX_COUNTRIES_PER_REQUEST) {
    return fetchDataBatch(codes, indicators, startYear, endYear)
  }

  const batches = chunkArray(codes, MAX_COUNTRIES_PER_REQUEST)
  const results = await Promise.allSettled(
    batches.map(batch => fetchDataBatch(batch, indicators, startYear, endYear))
  )

  return extractSuccessfulResults(results).flat()
}
