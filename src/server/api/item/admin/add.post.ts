const typeList = [
  'game_item', 'game_recharge'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { item_id, item_name, item_image, type } = body
    if(!type || !typeList.includes(type)) throw 'Kiểu vật phẩm không hỗ trợ'
    if(!item_name && !item_id) throw 'Dữ liệu đầu vào sai'

    const checkDup = await DB.Item.findOne({ item_id: item_id, type: type }).select('_id')
    if(!!checkDup) throw 'ID vật phẩm đã tồn tại'

    await DB.Item.create(body)
    return resp(event, { message: 'Thêm vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})