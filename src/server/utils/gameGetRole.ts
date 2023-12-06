import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

interface ISendData {
  account: string
  server_id: string
}

export default async (event: H3Event, data : ISendData) : Promise<any> => {
  try {
    const runtimeConfig = useRuntimeConfig()
    
    // Dev
    // if(!!runtimeConfig.dev) return Promise.resolve([{
    //   role_id: 1,
    //   role_name: 'Nhân vật 1'
    // }])

    // Prod
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.role) throw 'Tính năng tìm nhân vật trong trò chơi đang bảo trì'

    const send = await fetch(config.game.api.role, {
      method: 'post',
      body: JSON.stringify({
        secret: config.game.secret,
        ...data
      }),
      headers: {'Content-Type': 'application/json'}
    })

    const res = await send.json()
    if(res.error) throw res.error
    
    return Promise.resolve(res.data || [])
  }
  catch (e:any) {
    throw e.toString()
  }
}