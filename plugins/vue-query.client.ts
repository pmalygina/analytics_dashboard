import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { getErrorMessage } from '@/shared/lib'

interface ToastPlugin {
  error: (message: string) => void
  success: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

export default defineNuxtPlugin(nuxtApp => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  })

  if (process.client) {
    queryClient.getQueryCache().subscribe(event => {
      if (event?.type === 'updated' && event.query.state.error) {
        const message = getErrorMessage(event.query.state.error)
        const toast = nuxtApp.$toast as ToastPlugin | undefined
        toast?.error(message)
      }
    })
  }

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
})
