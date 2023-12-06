const typeList = [
  'game_item', 'game_recharge'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const {_id,  item_id, item_name, item_image } = body
    if(!_id || !item_id || !item_name) throw 'Dữ liệu đầu vào không hợp lệ'

    const item = await DB.Item.findOne({ _id: _id }).select('item_id type')
    if(!item) throw 'Vật phẩm không tồn tại'
    if(!typeList.includes(item.type)) throw 'Không thể sửa vật phẩm mặc định'

    if(item.item_id != item_id){
      const checkDup = await DB.Item.findOne({ item_id: item_id, type: item.type }).select('_id')
      if(!!checkDup) throw 'ID vật phẩm đã tồn tại'
    }

    delete body['_id']
    await DB.Item.updateOne({ _id: _id }, body)
    
    return resp(event, { message: 'Sửa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})