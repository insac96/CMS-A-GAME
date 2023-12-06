export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    deleteCookie(event, 'token-auth', runtimeConfig.cookieConfig)
    return resp(event, { message: 'Đăng xuất thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})