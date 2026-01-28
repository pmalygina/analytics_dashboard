declare module 'nuxt/app' {
  interface NuxtApp {
    $toast: {
      error: (message: string) => void
      success: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
  }
}

declare global {
  type Country = import('../src/shared/types/api').Country
  type WorldBankDataPoint = import('../src/shared/types/api').WorldBankDataPoint
  type WorldBankResponse = import('../src/shared/types/api').WorldBankResponse
  type WorldBankApiResponse = import('../src/shared/types/api').WorldBankApiResponse

  type PeriodPreset = import('../src/shared/types/filter').PeriodPreset

  type ChartType = import('../src/shared/types/chart').ChartType
  type ChartDataPoint = import('../src/shared/types/chart').ChartDataPoint
  type ChartSeries = import('../src/shared/types/chart').ChartSeries

  type PivotTableRow = import('../src/shared/types/table').PivotTableRow
  type PivotTableData = import('../src/shared/types/table').PivotTableData
}

export {}
