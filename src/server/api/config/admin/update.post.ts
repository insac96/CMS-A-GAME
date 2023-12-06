export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const data = await readBody(event)
    const { name, short_name, description } = data
    if(!name || !short_name || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    delete data['_id']
    await DB.Config.updateMany({}, data)

    logAdmin(event, 'Cập nhật thông tin trang');

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})