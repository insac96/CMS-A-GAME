export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Chưa đăng nhập, không thể đăng xuất'

    await DB.SocketOnline.updateOne({ user: auth._id }, { user: null })
    IO.emit('online-update')

    const runtimeConfig = useRuntimeConfig()
    deleteCookie(event, 'token-auth', runtimeConfig.cookieConfig)
    return resp(event, { message: 'Đăng xuất thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})