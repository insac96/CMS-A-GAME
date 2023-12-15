export default defineNuxtRouteMiddleware(async () => {
  if(process.server){
    const authStore = useAuthStore()
    const configStore = useConfigStore()
    const game = configStore.config.game
    if(!authStore.isLogin && !!game.landing) return navigateTo('/landing')
  }
})