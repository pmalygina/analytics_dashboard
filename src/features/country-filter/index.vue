<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-select
        v-model="selectedCountries"
        :items="countryItems"
        :loading="isLoading"
        label="Countries"
        multiple
        chips
        closable-chips
      >
        <template #prepend-item>
          <v-list-item
            v-if="isLoading"
            title="Loading countries..."
          />
        </template>

        <template #no-data>
          <v-list-item title="No countries available" />
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useCountries } from '@/shared/api/worldbank/use-worldbank'
import { toCountrySelectItems } from '@/entities/country'

const selectedCountries = defineModel<string[]>({ required: true })

const { data: countries, isLoading } = useCountries()

const countryItems = computed(() => toCountrySelectItems(countries.value || []))
</script>
