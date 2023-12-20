export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, link } = body
    if(!code || !link) throw 'Dữ liệu đầu vào sai'

    const checkDup = await DB.AdsLanding.findOne({ code: code }).select('_id')
    if(!!checkDup) throw 'Mã Landing đã tồn tại'

    await DB.AdsLanding.create(body)
    return resp(event, { message: 'Thêm Landing thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})