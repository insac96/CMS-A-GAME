export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 2) throw 'Admin mới có quyền xóa cấp độ'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const level = await DB.Level.findOne({ _id: _id }).select('_id number')
    if(!level) throw 'Cấp độ không tồn tại'
    if(level.number == 1) throw 'Không thể xóa cấp độ 1'

    await DB.Level.deleteOne({ _id: _id })

    logAdmin(event, `Xóa cấp độ <b>${level.number}</b>`)
    return resp(event, { message: 'Xóa cấp độ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})