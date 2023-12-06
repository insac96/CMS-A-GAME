import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password } = await readBody(event)
    if(!username || !password) throw 'Vui lòng nhập đầy đủ thông tin'

    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('password block type token') as IDBUser
    
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'

    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.cookieConfig)
    user.token = token
    await user.save()

    const IP = getRequestIP(event, { xForwardedFor: true })

    const logIP = await DB.LogUserIP.findOne({ user: user._id, ip: IP })
    if(!logIP) await DB.LogUserIP.create({ user: user._id, ip: IP })

    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: `Bạn đã đăng nhập với IP <b>${IP}</b>`
    })
    
    return resp(event, { message: 'Đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})