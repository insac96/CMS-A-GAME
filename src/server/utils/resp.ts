import type { H3Event } from 'h3'
import type { IResp } from '~~/types'

const AuthErrorMessage : any = {
  'AUTH-NO-TOKEN': 'Vui lòng đăng nhập trước',
  'AUTH-NO-USER': 'Xác thực tài khoản không thành công',
  'AUTH-DUP-LOGIN': 'Tài khoản đang đăng nhập ở nơi khác, vui lòng đăng nhập lại',
  'AUTH-BLOCK': 'Tài khoản đang bị khóa, vui lòng đăng nhập bằng tài khoản khác'
}

export default (event: H3Event, respData: IResp) => {
  let code = respData.code || 200
  let message = respData.message

  if(!!message && AuthErrorMessage[message]){
    code = 401
    message = AuthErrorMessage[message]
  }

  setResponseStatus(event, 200)

  return {
    ...respData,
    code: code,
    message: message
  }
}