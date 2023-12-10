export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const news = await DB.News.findOne({ _id: _id }).select('title')
    if(!news) throw 'Tin tức không tồn tại'

    await DB.News.deleteOne({ _id: _id })
    logAdmin(event, `Xóa tin tức <b>${news.title}</b>`)

    return resp(event, { message: 'Xóa tin tức thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})