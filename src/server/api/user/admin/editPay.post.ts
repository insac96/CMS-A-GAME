export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, pay } = await readBody(event)
    if(!_id || !pay) throw 'Dữ liệu đầu vào không hợp lệ'

    const { day, month, total } = pay
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.money))
      || !!isNaN(parseInt(month.money))
      || !!isNaN(parseInt(total.money))
      || parseInt(day.money) < 0
      || parseInt(month.money) < 0
      || parseInt(total.money) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username')
    if(!user) throw 'Người dùng không tồn tại'
    if(user.type > 0 && auth.type < 2) throw 'Smod không thể sửa thông tin quản trị viên khác'

    const update : any = {
      'pay.day.money': parseInt(day.money),
      'pay.month.money': parseInt(month.money),
      'pay.total.money': parseInt(total.money)
    }

    await DB.User.updateOne({ _id: _id }, update)
    logAdmin(event, `Sửa dữ liệu <b>tích nạp</b> tài khoản <b>${user.username}</b>`)
    return resp(event, { message: 'Sửa tích nạp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})