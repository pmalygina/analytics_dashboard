export interface PivotTableRow {
  year: string
  [country: string]: string | number | null
}

export interface PivotTableData {
  rows: PivotTableRow[]
  countries: string[]
  unit: string
}
