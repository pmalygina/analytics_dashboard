<template>
  <v-btn
    :disabled
    class="btn-export"
    prepend-icon="mdi-download"
    @click="$emit('click')"
  >
    {{ label }}
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  label?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  label: 'Export CSV',
})

defineEmits<{
  click: []
}>()
</script>
