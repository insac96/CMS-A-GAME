import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const data = await readBody(event)
    const { change, name, short_name, description, logo_image } = data
    if(!change || !name || !short_name || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    
    if(change == 'basic') logAdmin(event, 'Cập nhật thông tin <b>cơ bản</b> trang web')
    if(change == 'contact') logAdmin(event, 'Cập nhật thông tin <b>liên hệ</b> trang web')
    if(change == 'social') logAdmin(event, 'Cập nhật thông tin <b>mạng xã hội</b> trang web')
    if(change == 'game') logAdmin(event, 'Cập nhật cấu hình <b>trò chơi</b>')

    delete data['_id']
    delete data['change']
    await DB.Config.updateMany({}, data)

    if(!!logo_image){
      await DB.User.updateMany({
        avatar: '/images/user/default.png'
      }, {
        avatar: logo_image
      })
    }

    IO.emit('notice-reload', 'Có bản cập nhật mới, vui lòng tải lại trang !')

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})