<template>
  <v-container
    class="bg-orange-lighten-5"
    density="compact"
  >
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-2">Analytics Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis mb-4">
          World Bank GDP (Gross Domestic Product) data by country and year
        </p>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <CountryFilter v-model="filters.countries" />

        <DateRangeFilter
          v-model:start-year="filters.startYear"
          v-model:end-year="filters.endYear"
        />
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12">
        <DataChart
          :table-data
          :selected-countries
          :loading="isLoading"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <DataTable
          v-model:selected="selectedCountries"
          :table-data
          :loading="isLoading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { DataTable } from '@/widgets/data-table'
import { DataChart } from '@/widgets/data-chart'
import { CountryFilter } from '@/features/country-filter'
import { DateRangeFilter } from '@/features/date-range-filter'
import { useWorldBankPivotData } from '@/shared/api/worldbank/use-worldbank'
import { useFiltersStorage } from '@/shared/lib'

const selectedCountries = ref<string[]>([])

const { filters } = useFiltersStorage()

const { data: tableData, isLoading } = useWorldBankPivotData(
  computed(() => filters.value.countries),
  computed(() => filters.value.indicators),
  computed(() => filters.value.startYear),
  computed(() => filters.value.endYear)
)

watch(
  () => tableData.value?.countries,
  countries => {
    if (countries?.length) selectedCountries.value = [...countries]
  },
  { immediate: true }
)
</script>
