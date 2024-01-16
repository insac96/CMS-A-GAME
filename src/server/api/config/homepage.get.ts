import { IDBAdsLanding, IDBAdsTeaser, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select('enable homepage') as IDBConfig

    if(!!config.enable.teaser && !!config.homepage.teaser){
      const teaser = await DB.AdsTeaser.findOne({ _id: config.homepage.teaser }) as IDBAdsTeaser
      if(!!teaser) return resp(event, { result: `/ads/teaser/${teaser.code}` })
    }

    if(!!config.enable.landing && !!config.homepage.landing){
      const landing = await DB.AdsLanding.findOne({ _id: config.homepage.landing }) as IDBAdsLanding
      if(!!landing) return resp(event, { result: `/ads/landing/${landing.code}` })
    }

    return resp(event, { result: '/main' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})