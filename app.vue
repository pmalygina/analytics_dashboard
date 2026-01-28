<template>
  <ClientOnly>
    <v-app>
      <v-main>
        <NuxtPage />
      </v-main>
    </v-app>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </ClientOnly>
</template>
