import type { IGlobalDB } from '~~/types'

import mongoose from 'mongoose';
import Model from '../model'

// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

declare global {
  var DB : IGlobalDB
}

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  
  await mongoose.connect(runtimeConfig.mongoURI, { 
    dbName: runtimeConfig.mongoDB 
  })
  .then(() => {
    global.DB = Model(mongoose)
  })
  .catch(e => {
    throw createError({ statusCode: 500, message: e.toString() })
  })
})