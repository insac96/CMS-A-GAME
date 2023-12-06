export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 2) throw 'Chỉ Admin mới có quyền thêm cấp độ'

    const body = await readBody(event)
    const { number, bonus, discount } = body
    if(
      !!isNaN(parseInt(number)) 
      || !!isNaN(parseInt(bonus))
      || !!isNaN(parseInt(discount))
      || parseInt(bonus) < 0
      ||  parseInt(discount) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(parseInt(number) < 2) throw 'Cấp độ phải lớn hơn 1'

    const levelCheck = await DB.Level.findOne({ number: number }).select('_id')
    if(!!levelCheck) throw 'Số cấp độ đã tồn tại'

    await DB.Level.create(body)

    logAdmin(event, `Thêm cấp độ <b>${number}</b>`)
    return resp(event, { message: 'Thêm cấp độ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})