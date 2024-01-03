import type { H3Event } from 'h3'
import type { IAuth } from '~~/types'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')


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
      const start : any = dayjs().startOf('date')
      const end : any = dayjs().endOf('date')
      match['createdAt'] = { $gte: start['$d'], $lte: end['$d'] }
    }
    if(!!typeCheck[type] && typeCheck[type] == 'month'){
      const start : any = dayjs().startOf('month')
      const end : any = dayjs().endOf('month')
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