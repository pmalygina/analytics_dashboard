export interface Country {
  id: string
  name: string
  iso2Code?: string
  region?: {
    id: string
    value: string
  }
}

export interface WorldBankDataPoint {
  indicator: {
    id: string
    value: string
  }
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

export interface WorldBankResponse {
  page: number
  pages: number
  per_page: number
  total: number
  sourceid: string
  lastupdated: string
}

export interface WorldBankApiResponse {
  data: WorldBankDataPoint[]
  metadata: WorldBankResponse[]
}
