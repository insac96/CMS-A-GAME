export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, spend } = await readBody(event)
    if(!_id || !spend) throw 'Dữ liệu đầu vào không hợp lệ'

    const { day, month, total } = spend
    if(!day || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.coin))
      || !!isNaN(parseInt(month.coin))
      || !!isNaN(parseInt(total.coin))
      || parseInt(day.coin) < 0
      || parseInt(month.coin) < 0
      || parseInt(total.coin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username')
    if(!user) throw 'Người dùng không tồn tại'
    if(user.type > 0 && auth.type < 2) throw 'Smod không thể sửa thông tin quản trị viên khác'

    const update : any = {
      'spend.day.coin': parseInt(day.coin),
      'spend.month.coin': parseInt(month.coin),
      'spend.total.coin': parseInt(total.coin),
    }

    await DB.User.updateOne({ _id: _id }, update)
    logAdmin(event, `Sửa dữ liệu <b>tiêu phí</b> tài khoản <b>${user.username}</b>`)
    return resp(event, { message: 'Sửa tích nạp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})