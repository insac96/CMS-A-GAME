export default defineNuxtRouteMiddleware(async () => {
  const home = await useAPI('config/homepage')
  if(home != '/') return useTo().navigateToSSL(home)
})