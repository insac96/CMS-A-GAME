import jwt from 'jsonwebtoken'
import type { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const token = getCookie(event, 'token-auth')
    if(!token) return event.context.auth = undefined

    const decoded = jwt.verify(token, runtimeConfig.apiSecret) as any
    const user = await DB.User.findOne({ _id: decoded._id }).select('_id username block type token') as IDBUser
    if(!user) throw 'Xác thực tài khoản không thành công'
    if(user.token != token) throw 'Tài khoản đang đăng nhập ở nơi khác, vui lòng đăng nhập lại'
    if(user.block == 1) throw 'Tài khoản đang bị khóa, vui lòng đăng nhập bằng tài khoản khác'
    
    event.context.auth = { 
      _id: user._id,
      username: user.username,
      type: user.type
    }
  }
  catch (e:any) {
    event.context.auth = undefined
    deleteCookie(event, 'token-auth', runtimeConfig.cookieConfig)
    return resp(event, { code: 401, message: e.toString() })
  }
})