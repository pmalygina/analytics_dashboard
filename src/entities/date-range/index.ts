import { PERIOD_PRESETS, MIN_YEAR, MAX_YEAR, DEFAULT_PRESET_ID } from '@/shared/lib/constants'

const generateYears = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

export const generateYearStrings = (start: number, end: number): string[] =>
  generateYears(start, end).map(String).reverse()

export const getStartYearItems = (endYear: number): number[] =>
  generateYears(MIN_YEAR, endYear || MAX_YEAR)

export const getEndYearItems = (startYear: number): number[] =>
  generateYears(startYear || MIN_YEAR, MAX_YEAR)

export const findPresetById = (id: string) => PERIOD_PRESETS.find(p => p.id === id)

export const getDefaultPreset = () => findPresetById(DEFAULT_PRESET_ID)

export const findPresetByRange = (startYear: number, endYear: number) =>
  PERIOD_PRESETS.find(p => p.startYear === startYear && p.endYear === endYear)

export const normalizeYearRange = (start: number, end: number): [number, number] =>
  start > end ? [end, start] : [start, end]
