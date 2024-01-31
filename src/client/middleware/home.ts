export default defineNuxtRouteMiddleware(async () => {
  const home = await useAPI('config/homepage')
  return useTo().navigateToSSL(home)
})