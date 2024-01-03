import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

export default (date: Date | null, type : any) : any => {
  if(!date){
    const start : any = dayjs().startOf(type)
    const end : any = dayjs().endOf(type)
    return { start, end }
  }
  else {
    const start : any = dayjs(date).startOf(type)
    const end : any = dayjs(date).endOf(type)
    return { start, end }
  }
}