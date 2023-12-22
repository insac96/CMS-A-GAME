import type { H3Event } from 'h3'
import type { IDBUser, IResp, IAuth } from '~~/types'
import jwt from 'jsonwebtoken'

export default async (event: H3Event, throwError : boolean = true) : Promise<IAuth | IResp | null> => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const token = getCookie(event, 'token-auth')
    if(!token) throw 'AUTH-NO-TOKEN'

    const decoded = jwt.verify(token, runtimeConfig.apiSecret) as any
    const user = await DB.User.findOne({ _id: decoded._id }).select('username block type token') as IDBUser

    if(!user) throw 'AUTH-NO-USER'
    if(user.token != token) {
      await DB.SocketOnline.updateOne({ user: user._id }, { user: null })
      IO.emit('online-update')
      throw 'AUTH-DUP-LOGIN'
    }
    if(user.block == 1) {
      await DB.SocketOnline.updateOne({ user: user._id }, { user: null })
      IO.emit('online-update')
      throw 'AUTH-BLOCK'
    }

    const result = { 
      _id: user._id,
      username: user.username,
      type: user.type
    }
    event.context.auth = result
    return result
  }
  catch (e:any) {
    if(!!throwError) {
      deleteCookie(event, 'token-auth', runtimeConfig.cookieConfig)
      throw e.toString()
    }
    else return null
  }
}