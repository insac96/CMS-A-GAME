export default defineNuxtRouteMiddleware(async () => {
    try {
      const runtimeConfig = useRuntimeConfig()
      const authStore = useAuthStore()
      if(!authStore.isLogin) throw true
      
      await useAPI('game/closebeta')

      const playUrl = useCookie('play-closebeta-url', runtimeConfig.public.cookieConfig)
      if(!playUrl.value) throw true
    }
    catch (e:any) {
      return useTo().navigateToSSL('/')
    }
})