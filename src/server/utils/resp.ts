import type { H3Event } from 'h3'
import type { IResp } from '~~/types'

export default (event: H3Event, respData: IResp) => {
  setResponseStatus(event, 200)
  return {
    ...respData,
    code: respData.code || 200
  }
}