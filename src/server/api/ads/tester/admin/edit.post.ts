import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, link } = body
    if(!_id || !code || !link) throw 'Dữ liệu đầu vào không hợp lệ'

    const tester = await DB.AdsTester.findOne({ _id: _id }).select('code')
    if(!tester) throw 'Tester không tồn tại'

    if(tester.code != code){
      const checkDup = await DB.AdsTester.findOne({ code: code }).select('_id')
      if(!!checkDup) throw 'Mã Tester đã tồn tại'
    }

    delete body['_id']
    await DB.AdsTester.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa Tester Page mã <b>${tester.code}</b>`)
    return resp(event, { message: 'Sửa Tester thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})