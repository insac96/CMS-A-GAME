import type { H3Event } from 'h3'

export default async (event: H3Event, action: string) => {
  const auth = event.context.auth
  
  await DB.LogAdmin.create({
    user: auth._id,
    action: action
  })
}