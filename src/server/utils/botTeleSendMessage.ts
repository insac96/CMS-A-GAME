import type { H3Event } from 'h3'

export default async (message : string) : Promise<boolean> => {
  try {
    const BOT_TOKEN = '7538512281:AAEpWUcKqUtokXl_0ul6cy4Jy6rRO04l75E'
    const CHAT_ID = "-4202180921"
    const url = 'https://api.telegram.org/bot'+BOT_TOKEN+'/sendMessage'

    const send = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      }),
      headers: {'Content-Type': 'application/json'}
    })
    return true
  }
  catch (e:any) {
    console.log(e)
    return false
  }
}