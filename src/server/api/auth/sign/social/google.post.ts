import jwt from 'jsonwebtoken'
import { IDBConfig } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { code, redirect_uri } = await readBody(event)
    if(!code || !redirect_uri) throw 'Không tìm thấy mã ủy quyền hoặc URL ủy quyền'

    // Get Config
    const config = await DB.Config.findOne().select('google') as IDBConfig
    if(!config.google.client_id || !config.google.client_secret) throw 'Chức năng đăng nhập bằng Google đang bảo trì'

    // Get Access Token
    const urlAccess = `https://oauth2.googleapis.com/token`
    const paramsAccess = new URLSearchParams()
    paramsAccess.append('client_id', config.google.client_id)
    paramsAccess.append('client_secret', config.google.client_secret)
    paramsAccess.append('code', code)
    paramsAccess.append('grant_type', 'authorization_code')
    paramsAccess.append('redirect_uri', redirect_uri)

    let respAccess : any = await fetch(urlAccess, {
      method: 'POST',
      body: paramsAccess,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }
    })
    respAccess = await respAccess.json()
    const { access_token, token_type } = respAccess
    if(!access_token || !token_type) throw 'Không thể lấy mã xác thực'
    
    // Get User Info
    const urlUserInfo = `https://www.googleapis.com/oauth2/v3/userinfo`
    let respUserInfo : any = await fetch(urlUserInfo, {
      method: 'GET',
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    })
    respUserInfo = await respUserInfo.json()
    const { sub } = respUserInfo
    if(!sub) throw 'Không thể lấy thông tin người dùng'

    // Check User
    let user = await DB.User.findOne({ 'social.google': sub }).select('block')
    if(!!user){
      if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'
    } 

    // Create User
    if(!user){
      const avatar =  respUserInfo.picture || '/images/user/default.png'

      user = await DB.User.create({
        social: { google: sub },
        avatar: avatar,
        email: respUserInfo.email
      })
    }

    // Make Token
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    // Send Notify
    const IP = getRequestIP(event, { xForwardedFor: true })
    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: ` Bạn đã đăng nhập bằng <b>Google</b> với IP <b>${IP}</b>`
    })

    return resp(event, { message: 'Xác thực thành công', result: token })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})