import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBAdsTeaser, IDBConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password, confirm_password, teaser } = await readBody(event)

    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 15) throw 'Tài khoản trong khoảng 6-15 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    if (!confirm_password) throw 'Vui lòng nhập mật khẩu xác nhận'
    if (password != confirm_password) throw 'Mật khẩu xác nhận không khớp'

    // Config
    const config = await DB.Config.findOne({}).select('logo_image contact enable') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!config.enable.signup) throw 'Chức năng đăng ký đang bảo trì'

    // Check User
    const userCheck = await DB.User
    .findOne({ username: username })
    .select('username') as IDBUser

    if(!!userCheck) throw 'Tài khoản đã tồn tại'

    // Check Referral Code
    const referral : any = { code: `${config.contact.prefix || 'GAME'}-${username.toUpperCase()}` }

    // Check IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const logIP = await DB.LogUserIP.count({ ip: IP })
    if(logIP > 30) throw 'IP đã vượt quá giới hạn tạo tài khoản'

    // Teaser
    const teaserData = await DB.AdsTeaser.findOne({ _id: teaser }).select('code') as IDBAdsTeaser
    if(!teaserData) throw 'Mã Teaser không tồn tại'
    
    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      avatar: config.logo_image || '/images/user/default.png',
      reg: {
        teaser: teaserData._id
      },
      referral: referral,
      currency: {
        coin: 1000000
      }
    })

    // Update Ads Teaser
    await DB.AdsTeaser.updateOne({ _id: teaser }, { $inc: { 'sign.up': 1 }})

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id')
      if(!!adsFromData) await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.up': 1 }})
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Make Token And Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save IP
    await DB.LogUserIP.create({ user: user._id, ip: IP })

    // Save Log And Send Notify
    logUser(event, user._id, `Đăng ký tài khoản nhanh tại Teaser <b>${teaserData.code}</b> với IP <b>${IP}</b>`)
    await sendNotifyUser(event, {
      to: [ user._id ],
      color: 'primary',
      content: `Chào mừng thành viên mới, chúc bạn chơi game vui vẻ. Hãy nhớ truy cập trang thông tin và cập nhật <b>Email</b> và <b>Số điện thoại</b> để bảo mật tài khoản của mình nhé`
    })
    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: `Bạn đã đăng nhập với IP <b>${IP}</b>`
    })
    await createChat(event, 'bot', `Chào mừng thành viên mới <b>${user.username}</b>`)

    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})