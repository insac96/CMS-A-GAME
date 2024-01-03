import type { H3Event } from 'h3'
import type { IFormatDate } from '~~/types'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export default (event: H3Event, date?: Date) : IFormatDate => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

  const dateFormat = !!date ? dayjs(date) : null
  
  return {
    day: !!dateFormat ? dateFormat.get('date') : 0,
    month: !!dateFormat ? dateFormat.get('month') + 1 : 0,
    year: !!dateFormat ? dateFormat.get('year') : 0,
    hour: !!dateFormat ? dateFormat.get('hour') : 0,
    minute: !!dateFormat ? dateFormat.get('minute') : 0,
    timestamp: !!dateFormat ? dateFormat.unix() : 0,
    source: date
  }
}