import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await readBody(event)

    const auth = await getAuth(event) as IAuth
    let userCheck = !!user ? user : auth._id
    
    const userData = await DB.User
    .findOne({ _id: userCheck })
    .select('login pay spend wheel dice referral paymusty paydays')
    if(!userData) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: userData })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})