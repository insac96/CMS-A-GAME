export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('login pay spend wheel dice')
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})