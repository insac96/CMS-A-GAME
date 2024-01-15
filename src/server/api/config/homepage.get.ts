import { IDBAdsLanding, IDBAdsTester, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config
    .findOne()
    .select('enable homepage') as IDBConfig

    if(!!config.enable.tester && !!config.homepage.tester){
      const tester = await DB.AdsTester.findOne({ _id: config.homepage.tester }) as IDBAdsTester
      return resp(event, { result: `/ads/tester/${tester.code}` })
    }

    if(!!config.enable.landing && !!config.homepage.landing){
      const landing = await DB.AdsLanding.findOne({ _id: config.homepage.landing }) as IDBAdsLanding
      return resp(event, { result: `/ads/tester/${landing.code}` })
    }

    return resp(event, { result: '/main' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})