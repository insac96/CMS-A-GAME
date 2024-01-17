import type { H3Event } from 'h3'
import type { IAuth, IDBEventHistory } from '~~/types'

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

    const history = await DB.EventHistory
    .findOne({ user: auth._id, event: data._id })
    .select('_id')
    .sort({ createdAt: -1 })
    .limit(1) as IDBEventHistory

    if(!history) return Promise.resolve(0) // Có thể nhận

    if(!typeCheck[type]){
      if(!!history) return Promise.resolve(1) // Đã nhận
    }
    else {
      const time = DayJS(history.createdAt).unix()

      if(typeCheck[type] == 'day'){
        const start = DayJS().startOf('date').unix()
        const end = DayJS().endOf('date').unix()
        if(start <= time && time <= end) return Promise.resolve(1) // Đã nhận 
        return Promise.resolve(0) // Có thể nhận
      }
      if(typeCheck[type] == 'month'){
        const start = DayJS().startOf('month').unix()
        const end = DayJS().endOf('month').unix()
        if(start <= time && time <= end) return Promise.resolve(1) // Đã nhận 
        return Promise.resolve(0) // Có thể nhận
      }
    }
  }
  catch (e:any) {
    return Promise.resolve(-3) // Lỗi không xác định
  }
}