import type { H3Event } from 'h3'
import type { IDBShopConfig } from '~~/types'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export default (event: H3Event, body : IDBShopConfig) : number => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

  const defaultBonus = 0
  const limitDiscount = parseInt(String(body.discount.number || 0))
  const limitExpired = body.discount.expired

  if(!limitExpired) return limitDiscount
  else {
    const now = dayjs(new Date()).unix()
    const expired = dayjs(limitExpired).unix()

    if(now <= expired) return limitDiscount
    else return defaultBonus
  }
}