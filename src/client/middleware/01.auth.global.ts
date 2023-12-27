export default defineNuxtRouteMiddleware(async () => {
  const { setAuth } = useAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const token = useCookie('token-auth', runtimeConfig.cookieConfig)
  if(!token.value) return

  try{
    const auth = await useAPI('auth/get')
    return setAuth(auth)
  }
  catch(e){
    token.value = null
  }
})