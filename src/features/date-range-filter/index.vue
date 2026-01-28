<template>
  <v-row
    no-gutters
    class="d-flex align-items-center"
  >
    <v-col
      cols="12"
      md="auto"
    >
      <v-chip-group
        v-model="activePreset"
        @update:model-value="handlePresetClick"
      >
        <v-chip :value="PRESET_IDS.LAST_5_YEARS">5 years</v-chip>

        <v-chip :value="PRESET_IDS.LAST_10_YEARS">10 years</v-chip>

        <v-chip :value="PRESET_IDS.LAST_15_YEARS">15 years</v-chip>
      </v-chip-group>
    </v-col>

    <v-col
      cols="12"
      md="auto"
      class="d-flex mt-1"
    >
      <v-select
        :model-value="startYear"
        :items="startYearItems"
        label="From"
        density="compact"
        variant="outlined"
        class="year-select mr-2"
        @update:model-value="(val: number) => updateStartYear(val)"
      />

      <v-select
        :model-value="endYear"
        :items="endYearItems"
        label="To"
        density="compact"
        variant="outlined"
        class="year-select"
        @update:model-value="(val: number) => updateEndYear(val)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {
  getStartYearItems,
  getEndYearItems,
  findPresetById,
  findPresetByRange,
  normalizeYearRange,
} from '@/entities/date-range'
import { saveDatePreset } from '@/shared/lib/use-date-preset-storage'
import { PRESET_IDS } from '@/shared/lib/constants'

const startYear = defineModel<number>('startYear', { required: true })
const endYear = defineModel<number>('endYear', { required: true })

const activePreset = ref<string>(PRESET_IDS.CUSTOM)

const startYearItems = computed(() => getStartYearItems(endYear.value))
const endYearItems = computed(() => getEndYearItems(startYear.value))

const applyPreset = (preset: PeriodPreset) => {
  startYear.value = preset.startYear
  endYear.value = preset.endYear
  activePreset.value = preset.id
  saveDatePreset(preset.id)
}

const handlePresetClick = (presetId: string | null) => {
  if (!presetId) return
  const preset = findPresetById(presetId)
  if (preset) applyPreset(preset)
}

const updateYears = (start: number, end: number) => {
  const [normalizedStart, normalizedEnd] = normalizeYearRange(start, end)
  startYear.value = normalizedStart
  endYear.value = normalizedEnd

  const preset = findPresetByRange(normalizedStart, normalizedEnd)
  activePreset.value = preset?.id || PRESET_IDS.CUSTOM
  saveDatePreset(activePreset.value)
}

const updateStartYear = (val: number) => updateYears(val, endYear.value)
const updateEndYear = (val: number) => updateYears(startYear.value, val)

onMounted(() => {
  const preset = findPresetByRange(startYear.value, endYear.value)
  activePreset.value = preset?.id || PRESET_IDS.CUSTOM
})
</script>

<style scoped>
.year-select {
  max-width: 120px;
}
</style>
