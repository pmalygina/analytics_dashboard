export type ChartType = 'line' | 'bar'

export interface ChartDataPoint {
  year: string
  value: number | null
  country: string
}

export interface ChartSeries {
  name: string
  data: ChartDataPoint[]
  type: ChartType
}
