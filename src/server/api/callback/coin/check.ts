import { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { coin, username, secret } = await readBody(event)
    if(!secret) throw 'Không tìm thấy mã ủy quyền'
    if(secret != 'eni@gm') throw 'Mã ủy quyền không hợp lệ'

    if(!username) throw 'Không tìm thấy tên tài khoản'
    if(!coin) throw 'Không tìm thấy số xu'
    if(!!isNaN(parseInt(coin)) || parseInt(coin) < 1) throw 'Số xu không hợp lệ'

    const user = await DB.User.findOne({ username: username }).select('currency.coin') as IDBUser
    if(!user) throw 'Không tìm thấy tài khoản'
    
    return resp(event, { result: user.currency.coin >= coin ? true : false })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})