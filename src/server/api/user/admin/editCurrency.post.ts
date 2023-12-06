import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, type, plus, origin, reason } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type != 'plus' && type != 'origin') throw 'Kiểu chỉnh sửa không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const user = await DB.User.findOne({_id: _id}).select('username type currency') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'
    if(user.type > 0 && auth.type < 2) throw 'Smod không thể sửa thông tin quản trị viên khác'

    const update : any = {}

    if(type == 'plus'){
      if(
        !!isNaN(parseInt(plus.coin)) 
        || !!isNaN(parseInt(plus.wheel))
        || !!isNaN(parseInt(plus.notify))
      ) throw 'Dữ liệu tiền tệ không hợp lệ'
      update['$inc'] = {
        'currency.coin': parseInt(plus.coin), 
        'currency.wheel': parseInt(plus.wheel),
        'currency.notify': parseInt(plus.notify)
      }

      if(parseInt(plus.coin) > 0){
        logUser(event, user._id, `Nhận <b>${plus.coin.toLocaleString('vi-VN')}</b> xu từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    if(type == 'origin'){
      if(
        !!isNaN(parseInt(origin.coin)) 
        || !!isNaN(parseInt(origin.wheel))
        || !!isNaN(parseInt(origin.notify))
        || parseInt(origin.coin) < 0
        || parseInt(origin.wheel) < 0
        || parseInt(origin.notify) < 0
      ) throw 'Dữ liệu tiền tệ không hợp lệ'
      update['currency'] = origin
      
      if(origin.coin != user.currency.coin){
        logUser(event, user._id, `Số xu được thay đổi từ <b>${user.currency.coin.toLocaleString('vi-VN')}</b> thành <b>${origin.coin.toLocaleString('vi-VN')}</b> xu bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    const userUpdate = await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true }).select('currency')
    if(userUpdate.currency.coin < 0) userUpdate.currency.coin = 0
    if(userUpdate.currency.wheel < 0) userUpdate.currency.wheel = 0
    if(userUpdate.currency.notify < 0) userUpdate.currency.notify = 0
    await userUpdate.save()

    logAdmin(event, `Sửa <b>tiền tệ</b> tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
    return resp(event, { message: 'Sửa tiền tệ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})