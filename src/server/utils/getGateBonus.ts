import type { H3Event } from 'h3'

import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

interface IBodyData {
  default: number,
  limit: {
    number: number,
    expired: Date
  },
}

export default (event: H3Event, body : IBodyData) : number => {
  const defaultBonus = parseInt(String(body.default))
  const limitBonus = parseInt(String(body.limit.number || 0))
  const limitExpired = body.limit.expired

  if(limitBonus < 1 || (limitBonus > 0 && !limitExpired)) return defaultBonus
  else {
    const now = dayjs(new Date()).unix()
    const expired = dayjs(limitExpired).unix()

    if(now <= expired) return limitBonus
    else return defaultBonus
  }
}