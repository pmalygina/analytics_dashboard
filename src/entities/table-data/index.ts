import { NUMBER_FORMAT_RULES } from '@/shared/lib/constants'

export interface TableHeader {
  title: string
  key: string
  sortable: boolean
  fixed: boolean
}

const formatNumber = (value: number): string => {
  const rule = NUMBER_FORMAT_RULES.find(r => value >= r.threshold)
  return rule ? `${(value / rule.threshold).toFixed(2)}${rule.suffix}` : value.toFixed(2)
}

export const formatTableValue = (value: number | null, unit: string): string =>
  value == null ? 'No data' : `${formatNumber(value)} ${unit}`

const createYearHeader = (): TableHeader => ({
  title: 'Year',
  key: 'year',
  sortable: true,
  fixed: true,
})

const createCountryHeader = (country: string): TableHeader => ({
  title: country,
  key: country,
  sortable: false,
  fixed: false,
})

export const createTableHeaders = (countries: string[]): TableHeader[] => [
  createYearHeader(),
  ...countries.map(createCountryHeader),
]

const getUnique = <T>(items: T[]): T[] => [...new Set(items)]

const extractCountries = (data: WorldBankDataPoint[]): string[] =>
  getUnique(data.map(d => d.country.value)).sort()

const extractYears = (data: WorldBankDataPoint[]): string[] =>
  getUnique(data.map(d => d.date)).sort((a, b) => +b - +a)

const createValueMap = (data: WorldBankDataPoint[]): Map<string, number | null> =>
  new Map(data.map(d => [`${d.date}:${d.country.value}`, d.value]))

const createPivotRow = (
  year: string,
  countries: string[],
  valueMap: Map<string, number | null>
): PivotTableRow => {
  const row: PivotTableRow = { year }
  countries.forEach(c => (row[c] = valueMap.get(`${year}:${c}`) ?? null))
  return row
}

export const transformToPivotTable = (data: WorldBankDataPoint[]): PivotTableData => {
  const validData = data.filter(d => d.value !== null)
  if (!validData.length) return { rows: [], countries: [], unit: '' }

  const countries = extractCountries(validData)
  const years = extractYears(validData)
  const valueMap = createValueMap(validData)

  return {
    rows: years.map(year => createPivotRow(year, countries, valueMap)),
    countries,
    unit: validData[0]?.unit || '',
  }
}
