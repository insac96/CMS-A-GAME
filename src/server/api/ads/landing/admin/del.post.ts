export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const landing = await DB.AdsLanding.findOne({ _id: _id }).select('_id')
    if(!landing) throw 'Landing không tồn tại'

    const user = await DB.User.count({
      'reg.landing': landing._id
    })
    if(user > 0) throw 'Không thể xóa Landing đã có người tương tác'

    await DB.AdsLanding.deleteOne({ _id: _id })
    return resp(event, { message: 'Xóa Landing thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})