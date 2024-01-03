import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/vi'

dayjs.locale('vi')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

export const useDayJs = () => {
  const fromTime = (start : Date, end? : Date, noSuffix : boolean = false) : string => {
    const startDayJS = dayjs(start)
    const endDayJS = dayjs(end || new Date())
    return startDayJS.from(endDayJS, noSuffix) as string
  }

  const displayTime = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD [Th]MM YYYY')
  }

  const displayFull = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD [Th]MM YYYY [lúc] HH:mm')
  }

  return { dayjs, fromTime, displayTime, displayFull }
}