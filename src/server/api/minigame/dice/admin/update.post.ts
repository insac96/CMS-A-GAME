export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { jar, percent } = await readBody(event)
    if(!jar || !percent) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(jar.default)) || parseInt(jar.default) < 0
      || !!isNaN(parseInt(jar.now)) || parseInt(jar.now) < 0
      || !!isNaN(parseInt(percent.win)) || parseInt(percent.win) < 0
      || !!isNaN(parseInt(percent.six)) || parseInt(percent.six) < 0
      || !!isNaN(parseInt(percent.other)) || parseInt(percent.other) < 0
    ) throw 'Dữ liệu đầu vào sai'

    await DB.Dice.updateMany({}, { jar, percent })

    logAdmin(event, `Sửa thông tin xúc xắc`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})