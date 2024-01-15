export default defineNuxtRouteMiddleware(async () => {
  //if(process.server) return
  const home = await useAPI('config/homepage')
  return useTo().navigateToSSL(home)
})