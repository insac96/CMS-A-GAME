import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

declare global {
  var DayJS : any
}

export default defineNitroPlugin(async (nitroApp) => {
  // dayjs.extend(utc)
  // dayjs.extend(timezone)
  // dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

  global.DayJS = dayjs
})
