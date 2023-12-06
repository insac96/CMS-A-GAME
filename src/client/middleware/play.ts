export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    if(!authStore.isLogin) throw true
    if(!gameStore.url) throw true
  }
  catch (e:any) {
    return navigateTo('/')
  }
})