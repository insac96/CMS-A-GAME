export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, content } = await readBody(event)
    if(!_id || !content) throw 'Dữ liệu đầu vào không đủ'

    const news = await DB.News
    .findOne({ _id: _id })
    .select('_id')

    if(!news) throw 'Tin tức không tồn tại'

    await DB.News.updateOne({ 
      _id: _id 
    },{ 
      content: content, 
      updater: auth._id 
    })

    return resp(event, { message: 'Cập nhật nội dung thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})