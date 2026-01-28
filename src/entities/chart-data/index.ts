import { NUMBER_FORMAT_RULES } from '@/shared/lib/constants'

const createDataPoint = (row: PivotTableRow, country: string): ChartDataPoint => ({
  year: row.year,
  value: (row[country] as number) ?? null,
  country,
})

const sortByYear = (points: ChartDataPoint[]): ChartDataPoint[] =>
  [...points].sort((a, b) => +a.year - +b.year)

const extractCountryData = (rows: PivotTableRow[], country: string): ChartDataPoint[] =>
  sortByYear(rows.map(row => createDataPoint(row, country)))

const createSeriesName = (country: string, unit: string): string => `${country} ${unit}`.trim()

const createChartSeries = (rows: PivotTableRow[], country: string, unit: string): ChartSeries => ({
  name: createSeriesName(country, unit),
  data: extractCountryData(rows, country),
  type: 'line',
})

export const transformPivotToChartData = (
  pivotData: PivotTableData,
  selectedCountries: string[]
): ChartSeries[] => {
  if (!pivotData.rows.length || !selectedCountries.length) return []
  return selectedCountries.map(country =>
    createChartSeries(pivotData.rows, country, pivotData.unit)
  )
}

export const formatAxisValue = (value: number): string => {
  const rule = NUMBER_FORMAT_RULES.find(r => value >= r.threshold)
  return rule ? `${(value / rule.threshold).toFixed(1)}${rule.suffix}` : value.toFixed(0)
}

export const extractUniqueYears = (rows: PivotTableRow[]): string[] =>
  [...new Set(rows.map(r => r.year))].sort()

export const isValidSeries = (series: unknown): boolean => {
  if (!series || typeof series !== 'object') return false
  const s = series as Record<string, unknown>
  return Boolean(s.name && s.type && Array.isArray(s.data) && (s.data as unknown[]).length > 0)
}

export const filterValidSeries = <T>(series: T[]): T[] => series.filter(isValidSeries)
