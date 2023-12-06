import type { H3Event } from 'h3'
import type { IFormatDate } from '~~/types'
import dayjs from 'dayjs'

export default (event: H3Event, date?: Date) : IFormatDate => {
  const dateFormat = !!date ? dayjs(date) : null
  
  return {
    day: !!dateFormat ? dateFormat.get('date') : 0,
    month: !!dateFormat ? dateFormat.get('month') + 1 : 0,
    year: !!dateFormat ? dateFormat.get('year') : 0,
    timestamp: !!dateFormat ? dateFormat.unix() : 0,
    source: date
  }
}