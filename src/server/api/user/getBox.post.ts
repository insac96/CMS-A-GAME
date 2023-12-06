export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    const { _id } = await readBody(event)

    const select = ['username', 'avatar', 'level', 'type']
    if(!!auth && (auth.type > 0 || auth._id == _id)){
      select.push(...['currency', 'email', 'phone', 'referral'])
    }

    const user = await DB.User
    .findOne({ _id: _id })
    .select(select.join(' '))
    .populate({
      path: 'level',
      select: 'number'
    })

    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})