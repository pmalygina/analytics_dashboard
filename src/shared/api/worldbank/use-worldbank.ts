import { useQuery } from '@tanstack/vue-query'
import { fetchCountries, fetchWorldBankData } from './index'
import { transformToPivotTable } from '@/entities/table-data'
import { generateYearStrings } from '@/entities/date-range'
import { STALE_TIME_ONE_HOUR, STALE_TIME_FIVE_MINUTES } from '@/shared/lib/constants'

export const useCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: STALE_TIME_ONE_HOUR,
  })

const createCountryNameMap = (countries: Country[] | undefined): Map<string, string> =>
  new Map(countries?.map(c => [c.id, c.name]) || [])

const createPivotRow = (
  year: string,
  countries: string[],
  existingRow: PivotTableRow | undefined
): PivotTableRow => {
  const row: PivotTableRow = { year }
  countries.forEach(c => (row[c] = existingRow?.[c] ?? null))
  return row
}

export const useWorldBankPivotData = (
  countries: MaybeRef<string[]>,
  indicators: MaybeRef<string[]>,
  startYear: MaybeRef<number>,
  endYear: MaybeRef<number>
) => {
  const { data: countriesList } = useCountries()
  const countryNames = computed(() => createCountryNameMap(countriesList.value))

  const { data, isLoading, error } = useQuery({
    queryKey: computed(() => [
      'worldBankData',
      [...toValue(countries)].sort().join(','),
      [...toValue(indicators)].sort().join(','),
      toValue(startYear),
      toValue(endYear),
    ]),
    queryFn: () =>
      fetchWorldBankData(
        toValue(countries),
        toValue(indicators),
        toValue(startYear),
        toValue(endYear)
      ),
    enabled: computed(() => toValue(countries).length > 0 && toValue(indicators).length > 0),
    staleTime: STALE_TIME_FIVE_MINUTES,
    retry: 1,
  })

  const pivotData = computed(() => {
    const codes = toValue(countries)
    const start = toValue(startYear)
    const end = toValue(endYear)

    if (!codes.length) return { rows: [], countries: [], unit: '' }

    const names = codes.map(c => countryNames.value.get(c) || c)
    const years = generateYearStrings(start, end)
    const transformed = data.value ? transformToPivotTable(data.value) : null
    const allCountries = [...new Set([...(transformed?.countries || []), ...names])].sort()

    const rows = years.map(year => {
      const existingRow = transformed?.rows.find(r => r.year === year)
      return createPivotRow(year, allCountries, existingRow)
    })

    return { rows, countries: allCountries, unit: transformed?.unit || '' }
  })

  return { data: pivotData, isLoading, error }
}
