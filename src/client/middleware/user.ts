export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw 'Vui lòng đăng nhập trước'
  }
  catch (e:any) {
    if(process.server) return navigateTo('/')
    if(process.client) return useTo().navigateToSSL('/')
  }
})