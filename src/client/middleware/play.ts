export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    if(!authStore.isLogin) throw true

    const PlayUrl = useCookie('play-url', runtimeConfig.cookieConfig)
    if(!PlayUrl.value) throw true
  }
  catch (e:any) {
    return navigateTo('/')
  }
})