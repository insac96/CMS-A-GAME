import type { IDBLevel, IDBUser, IDBUserStore } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // Get Auth
    const auth = event.context.auth
    if(!auth) throw 'Không tìm thấy mã xác thực tài khoản'

    // Get User
    const { _id } = auth
    const user = await DB.User.findOne({ _id: _id }) as IDBUser
    if(!user) throw 'Không tìm thấy tài khoản'
    if(user.block == 1) throw 'Tài khoản đang bị khóa'

    // Get Date
    const now  = new Date()
    const nowDate = formatDate(event, now)
    const lastDate = formatDate(event, user.login.update)
    const IP = getRequestIP(event, { xForwardedFor: true })
    user.login.update = now
    user.login.last_ip = IP as string

    // Is Next Day
    if(
      lastDate.day != nowDate.day 
      || lastDate.month != nowDate.month 
      || lastDate.year != lastDate.year
    ){
      user.login.month = user.login.month + 1
      user.login.total = user.login.total + 1
      user.pay.day.money = 0
      user.pay.day.count = 0
      user.spend.day.coin = 0
      user.spend.day.count = 0
      user.dice.day.coin = 0
      user.dice.day.count = 0
      user.wheel.day = 0
    }

    // Is Next Month
    if(
      lastDate.month != nowDate.month
      || lastDate.year != nowDate.year
    ){
      user.login.month = 1
      user.pay.month.money = 0
      user.pay.month.count = 0
      user.spend.month.coin = 0
      user.spend.month.count = 0
      user.dice.month.coin = 0
      user.dice.month.count = 0
      user.wheel.month = 0
    }

    // Update Level
    const realLevel = await DB.Level.findOne({
      $and: [
        { 'need.login': { $lte: user.login.total } },
        { 'need.pay.money': { $lte: user.pay.total.money } },
        { 'need.pay.count': { $lte: user.pay.total.count } },
        { 'need.spend.coin': { $lte: user.pay.total.money } },
        { 'need.spend.count': { $lte: user.pay.total.count } },
      ]
    })
    .select('number')
    .sort({ number: -1 }) as IDBLevel
    user.level = realLevel._id

    // Save
    await user.save()

    // Result
    const userStore : IDBUserStore = {
      _id: user._id,
      username: user.username,
      level: realLevel.number,
      type: user.type,
      referral_code: user.referral.code
    }

    userStore.notify = await DB.NotifyUser.count({ 
      to: { $elemMatch: { user: user._id, watched: 0 }} 
    })

    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    const runtimeConfig = useRuntimeConfig()
    deleteCookie(event, 'token-auth', runtimeConfig.cookieConfig)
    return resp(event, { code: 401, message: e.toString() })
  }
})