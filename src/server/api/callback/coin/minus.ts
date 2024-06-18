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
    if(user.currency.coin < coin) throw 'Số dư xu không đủ'

    await DB.User.updateOne({ _id: user._id },{
      $inc: { 'currency.coin': Number(coin) * -1 }
    })

    return resp(event, { message: 'Trừ xu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})