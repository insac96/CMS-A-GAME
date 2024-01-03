import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

declare global {
  var DayJS : any
}

export default defineNitroPlugin(async (nitroApp) => {
  global.DayJS = dayjs
})