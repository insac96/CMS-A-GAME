export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    if(!password) throw 'Vui lòng nhập đầy đủ thông tin'
    if(password != 'eni@gm') throw 'Mã ủy quyền không hợp lệ'
    return resp(event, { message: 'Xác thực quản trị viên thành công', result: '/@eni' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})