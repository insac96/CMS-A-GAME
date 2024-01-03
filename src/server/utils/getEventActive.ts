import type { H3Event } from 'h3'
import type { IAuth } from '~~/types'

const typeCheck : any = {
  'login.month' : 'month',
  'pay.day.money' : 'day',
  'pay.month.money' : 'month',
  'spend.day.coin': 'day', 
  'spend.month.coin': 'month'
}

export default async (event: H3Event, data : any, type : string) : Promise<any> => {
  try {
    const auth = await getAuth(event, false) as IAuth | null
    if(!auth) return Promise.resolve(-2) // Chưa đăng nhập

    let check : any
    const user = await DB.User.findOne({ _id: auth._id }).select(`${type}`)
    const typeArray = type.split('.')
    typeArray.forEach((i : string) => {
      if(!check) check = user[i]
      else check = check[i]
    })

    if(data.need > check) return Promise.resolve(-1) // Chưa đạt điều kiện

    const match : any = { user: auth._id, event: data._id }
    if(!!typeCheck[type] && typeCheck[type] == 'day'){
      const start : any = DayJS().startOf('date')
      const end : any = DayJS().endOf('date')
      match['createdAt'] = { $gte: start['$d'], $lte: end['$d'] }
    }
    if(!!typeCheck[type] && typeCheck[type] == 'month'){
      const start : any = DayJS().startOf('month')
      const end : any = DayJS().endOf('month')
      match['createdAt'] = { $gte: start['$d'], $lte: end['$d'] }
    }

    const history = await DB.EventHistory.findOne(match).select('_id')
    if(!history) return Promise.resolve(0) // Có thể nhận
    else return Promise.resolve(1) // Đã nhận
  }
  catch (e:any) {
    return Promise.resolve(-3) // Lỗi không xác định
  }
}