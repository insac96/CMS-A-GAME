export default defineNuxtRouteMiddleware(async () => {
  try{
    const home = await useAPI('config/homepage')
    if(process.server) return navigateTo(home)
    if(process.client) return useTo().navigateToSSL(home)
  }
  catch(e){
    if(process.server) return navigateTo('/main')
    if(process.client) return useTo().navigateToSSL('/main')
  }
})