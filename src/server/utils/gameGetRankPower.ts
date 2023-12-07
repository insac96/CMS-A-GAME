import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

interface ISendData {
  server_id: string
}

export default async (event: H3Event, data : ISendData) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.rank_power) throw 'Tính năng xem bảng xếp hạng lực chiến đang bảo trì'

    const send = await fetch(config.game.api.rank_power, {
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