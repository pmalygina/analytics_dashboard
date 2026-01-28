const SPECIAL_CHARS = [',', '"', '\n']

const escapeCSVValue = (value: string | number | null): string => {
  if (value == null) return ''
  const str = String(value)
  return SPECIAL_CHARS.some(c => str.includes(c)) ? `"${str.replace(/"/g, '""')}"` : str
}

const createCSVRow = (values: (string | number | null)[]): string =>
  values.map(escapeCSVValue).join(',')

export const pivotTableToCSV = (data: PivotTableData): string => {
  if (!data.rows.length) return ''

  const headers = ['Year', ...data.countries]
  const headerRow = createCSVRow(headers)

  const dataRows = data.rows.map(row =>
    createCSVRow([row.year, ...data.countries.map(c => row[c])])
  )

  return [headerRow, ...dataRows].join('\n')
}

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob(['\ufeff', content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const exportPivotTableToCSV = (data: PivotTableData, filename = 'export.csv'): void => {
  const csv = pivotTableToCSV(data)
  if (csv) downloadFile(csv, filename, 'text/csv;charset=utf-8;')
}
