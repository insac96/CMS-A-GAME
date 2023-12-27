export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    if(!authStore.isLogin) throw true

    const playUrl = useCookie('play-url', runtimeConfig.cookieConfig)
    if(!playUrl.value) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})