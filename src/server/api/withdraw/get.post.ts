import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID giao dịch'

    const withdraw = await DB.Withdraw.findOne({ _id: _id })
    if(!withdraw) throw 'Giao dịch không tồn tại'
    if(withdraw.user.toString() != auth._id.toString()) throw 'Bạn không phải chủ giao dịch'

    return resp(event, { result: withdraw })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})