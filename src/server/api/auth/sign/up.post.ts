import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password, email, phone, referral_code } = await readBody(event)

    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 15) throw 'Tài khoản trong khoảng 6-15 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'

    if (!email) throw 'Vui lòng nhập Email'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    if (!phone) throw 'Vui lòng nhập số điện thoại'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Check User
    const userCheck = await DB.User
    .findOne({ 
      $or: [
        { username: username },
        { phone: phone },
        { email: email }
      ]
    })
    .select('username email phone') as IDBUser

    if(!!userCheck){
      if(userCheck.username == username) throw 'Tài khoản đã tồn tại'
      if(userCheck.phone == phone) throw 'Số điện thoại đã tồn tại'
      if(userCheck.email == email) throw 'Địa chỉ Email đã tồn tại'
    }

    // Check Referral Code
    const referral : any = { code: `CVV-${username.toUpperCase()}` }
    if(!!referral_code){
      const referraler = await DB.User.findOne({ 'referral.code': referral_code }).select('_id')
      if(!referraler) throw 'Mã mời không tồn tại'
      
      referral.person = referraler._id
      await DB.User.updateOne({ _id: referraler._id }, { $inc: { 'referral.count': 1 }})
    }

    // Check IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const logIP = await DB.LogUserIP.count({ ip: IP })
    if(logIP > 5) throw 'IP đã vượt quá giới hạn tạo tài khoản'
    
    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      phone: phone,
      email: email,
      referral: referral
    })

    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.cookieConfig)
    user.token = token
    await user.save()

    await DB.LogUserIP.create({
      user: user._id,
      ip: IP
    })

    logUser(event, user._id, 'Đăng ký tài khoản')
    
    await sendNotifyUser(event, {
      to: [ user._id ],
      color: 'primary',
      content: `Chào mừng thành viên mới, chúc bạn chơi game vui vẻ`
    })

    await sendNotifyUser(event, {
      to: [ user._id ],
      type: 3,
      color: 'blue',
      content: `Bạn đã đăng nhập với IP <b>${IP}</b>`
    })
    
    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})