export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    if(!authStore.isLogin) throw true

    const playUrl = useCookie('play-url', runtimeConfig.public.cookieConfig)
    if(!playUrl.value) throw true
  }
  catch (e:any) {
    if(process.server) return navigateTo('/')
    if(process.client) return useTo().navigateToSSL('/')
  }
})