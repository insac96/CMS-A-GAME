import jwt from 'jsonwebtoken'
import { IDBConfig } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { code, redirect_uri } = await readBody(event)
    if(!code || !redirect_uri) throw 'Không tìm thấy mã ủy quyền hoặc URL ủy quyền'

    // Get Config
    const config = await DB.Config.findOne().select('facebook') as IDBConfig
    if(
      !config.facebook.client_id 
      || !config.facebook.client_secret
      || !config.facebook.client_version
    ) throw 'Chức năng đăng nhập bằng Facebook đang bảo trì'

    // Get Access Token
    const urlAccess = `https://graph.facebook.com/${config.facebook.client_version}/oauth/access_token`
    const paramsAccess = new URLSearchParams()
    paramsAccess.append('client_id', config.facebook.client_id)
    paramsAccess.append('client_secret', config.facebook.client_secret)
    paramsAccess.append('code', code)
    paramsAccess.append('redirect_uri', `${redirect_uri}`)
    const strParamsAccess = paramsAccess.toString()

    let respAccess : any = await fetch(`${urlAccess}?${strParamsAccess}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    respAccess = await respAccess.json()
    const { access_token } = respAccess
    if(!access_token) throw 'Không thể lấy mã xác thực'

    // Get User Info
    const urlUserInfo = `https://graph.facebook.com/me?access_token=${access_token}`
    let respUserInfo : any = await fetch(urlUserInfo)
    respUserInfo = await respUserInfo.json()
    const { id } = respUserInfo
    if(!id) throw 'Không thể lấy thông tin người dùng'

    // Check User
    let user = await DB.User.findOne({ 'social.facebook': id }).select('block')
    if(!!user){
      if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'
    } 

    // Create User
    if(!user){
      let respUserPicture : any = await fetch(`https://graph.facebook.com/${id}?fields=picture&access_token=${access_token}`)
      respUserPicture = await respUserPicture.json()
      const { picture } = respUserPicture
      const avatar = (!!picture && !!picture['data'] && !!picture['data']['url']) ? picture['data']['url'] : '/images/user/default.png'

      user = await DB.User.create({
        social: { facebook: id },
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
      content: ` Bạn đã đăng nhập bằng <b>Facebook</b> với IP <b>${IP}</b>`
    })

    return resp(event, { message: 'Xác thực thành công', result: token })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})