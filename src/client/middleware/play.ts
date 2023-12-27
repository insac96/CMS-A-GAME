export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    if(!authStore.isLogin) throw true

    const playCookie = useCookie('play-url', runtimeConfig.cookieConfig)
    const playStore = gameStore.url

    if(!playCookie.value && playStore) throw true
  }
  catch (e:any) {
    return navigateTo('/')
  }
})