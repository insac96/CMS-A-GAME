import type { H3Event } from 'h3'
import axios from 'axios'

export default async (message : string) : Promise<boolean> => {
  try {
    const BOT_TOKEN = '7538512281:AAEpWUcKqUtokXl_0ul6cy4Jy6rRO04l75E'
    const CHAT_ID = "-4202180921"
    const url = 'https://api.telegram.org/bot'+BOT_TOKEN+'/sendMessage'

    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message
    })

    return true
  }
  catch (e:any) {
    return false
  }
}