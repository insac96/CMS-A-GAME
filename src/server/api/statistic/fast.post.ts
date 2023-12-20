import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { type } = await readBody(event)

    const matchPayment : any = { status: 1 }
    const matchSignIn : any = {}
    const matchSignUp : any = {}

    let start : any, end : any
    if(type == 'day'){
      start = dayjs().startOf('date')
      end = dayjs().endOf('date')
    }
    if(type == 'month'){
      start = dayjs().startOf('month')
      end = dayjs().endOf('month')
    }
    if(type == 'day' || type == 'month'){
      matchPayment['verify.time'] = { $gte: start['$d'], $lte: end['$d'] }
      matchSignIn['login.update'] = { $gte: start['$d'], $lte: end['$d'] }
      matchSignUp['createdAt'] = { $gte: start['$d'], $lte: end['$d'] }
    }

    const payment = await DB.Payment.aggregate([
      { $match: matchPayment },
      { $group: { _id: null, total: { $sum: '$money' }}}
    ])

    const signin = await DB.User.count(matchSignIn)
    const signup = await DB.User.count(matchSignUp)

    return resp(event, {
      result: {
        payment: payment[0] ? payment[0]['total'] : 0,
        signin: signin,
        signup: signup
      }
    })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})