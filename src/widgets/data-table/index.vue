<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Data Table</span>

      <Button
        :disabled="!tableData.rows.length"
        @click="handleExport"
      />
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="computedHeaders"
        :items="pivotData.rows"
        :items-per-page
        :loading
        :sort-by
        @update:options="handleOptionsUpdate"
      >
        <template
          v-for="header in computedHeaders"
          :key="header.key"
          #[`header.${header.key}`]
        >
          <span v-if="header.key === 'year'">{{ header.title }}</span>

          <div
            v-else
            class="d-flex flex-column align-center ga-1"
          >
            <v-checkbox
              :model-value="selectedCountries.includes(header.key)"
              density="compact"
              hide-details
              class="flex-grow-0 flex-shrink-0 ma-0 pa-0"
              @update:model-value="(val: boolean | null) => toggleCountry(header.key, val ?? false)"
            />

            <span class="text-caption text-center text-truncate w-100">
              {{ header.title }}
            </span>
          </div>
        </template>

        <template
          v-for="country in pivotData.countries"
          :key="`item-${country}`"
          #[`item.${country}`]="{ value }"
        >
          <div class="d-flex justify-center">
            {{ formatTableValue(value as number | null, pivotData.unit) }}
          </div>
        </template>

        <template #no-data>
          <div class="no-data-container">
            <p>No data available</p>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { formatTableValue, createTableHeaders } from '@/entities/table-data'
import { exportPivotTableToCSV } from '@/shared/lib/csv-export'
import { Button } from '@/shared/ui'

interface Props {
  tableData: PivotTableData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  tableData: () => ({ rows: [], countries: [], unit: '' }),
})

const itemsPerPage = ref(10)
const sortBy = ref([{ key: 'year', order: 'desc' as const }])
const selectedCountries = defineModel<string[]>('selected', { default: () => [] })

const pivotData = computed(() => props.tableData)
const computedHeaders = computed(() => createTableHeaders(pivotData.value.countries))

const handleOptionsUpdate = (options: { itemsPerPage?: number }) => {
  if (options.itemsPerPage) itemsPerPage.value = options.itemsPerPage
}

const toggleCountry = (country: string, value: boolean) => {
  if (value && !selectedCountries.value.includes(country)) {
    selectedCountries.value = [...selectedCountries.value, country]
  } else if (!value) {
    selectedCountries.value = selectedCountries.value.filter(c => c !== country)
  }
}

const handleExport = () => {
  if (!props.tableData.rows.length) return
  const filename = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`
  exportPivotTableToCSV(props.tableData, filename)
}
</script>
