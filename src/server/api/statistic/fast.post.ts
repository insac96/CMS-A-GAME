import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { type } = await readBody(event)

    const matchPayment : any = { status: 1 }
    const matchSignIn : any = {}
    const matchSignUp : any = {}

    let start : any, end : any
    if(type == 'day'){
      start = DayJS().startOf('date')
      end = DayJS().endOf('date')
    }
    if(type == 'month'){
      start = DayJS().startOf('month')
      end = DayJS().endOf('month')
    }
    if(type == 'day' || type == 'month'){
      matchPayment['verify.time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
      matchSignIn['login.update'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
      matchSignUp['createdAt'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
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