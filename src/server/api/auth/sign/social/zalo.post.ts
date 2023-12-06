import jwt from 'jsonwebtoken'
import { IDBConfig } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { code, redirect_uri } = await readBody(event)
    if(!code || !redirect_uri) throw 'Không tìm thấy mã ủy quyền hoặc URL ủy quyền'

    // Get Config
    const config = await DB.Config.findOne().select('zalo') as IDBConfig
    if(!config.zalo.client_id || !config.zalo.client_secret) throw 'Chức năng đăng nhập bằng Zalo đang bảo trì'

    // Get Access Token
    const urlAccess= 'https://oauth.zaloapp.com/v4/access_token'
    const paramsAccess = new URLSearchParams()
    paramsAccess.append('app_id', config.zalo.client_id)
    paramsAccess.append('code', code)
    paramsAccess.append('grant_type', 'authorization_code')

    let respAccess : any = await fetch(urlAccess, {
      method: 'POST',
      body: paramsAccess,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'secret_key': config.zalo.client_secret
      }
    })
    respAccess = await respAccess.json()
    const { access_token } = respAccess
    if(!access_token) throw 'Không thể lấy mã xác thực'

    // Get User Info
    const urlUserInfo = 'https://graph.zalo.me/v2.0/me?fields=id,name,picture'
    let respUserInfo : any = await fetch(urlUserInfo, {
      method: 'GET',
      headers: {
        'access_token': access_token
      }
    })
    respUserInfo = await respUserInfo.json()
    const { id } = respUserInfo
    if(!id) throw 'Không thể lấy thông tin người dùng'

    // Check User
    let user = await DB.User.findOne({ 'social.zalo': id }).select('block')
    if(!!user){
      if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'
    } 

    // Create User
    if(!user){
      const picture = respUserInfo.picture
      const avatar = (!!picture && !!picture['data'] && !!picture['data']['url']) ? picture['data']['url'] : '/images/user/default.png'
      user = await DB.User.create({
        social: { zalo: id },
        avatar: avatar
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
      content: ` Bạn đã đăng nhập bằng <b>Zalo</b> với IP <b>${IP}</b>`
    })

    return resp(event, { message: 'Xác thực thành công', result: token })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})