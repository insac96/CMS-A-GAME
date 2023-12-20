export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, link } = body
    if(!_id || !code || !link) throw 'Dữ liệu đầu vào không hợp lệ'

    const landing = await DB.AdsLanding.findOne({ _id: _id }).select('code')
    if(!landing) throw 'Landing không tồn tại'

    if(landing.code != code){
      const checkDup = await DB.AdsLanding.findOne({ code: code }).select('_id')
      if(!!checkDup) throw 'Mã Landing đã tồn tại'
    }

    delete body['_id']
    await DB.AdsLanding.updateOne({ _id: _id }, body)
    
    return resp(event, { message: 'Sửa Landing thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})