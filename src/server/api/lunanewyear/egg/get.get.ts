import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    let user
    const auth = await getAuth(event, false) as IAuth | null
    if(!!auth){
      user = await DB.User
      .findOne({ _id: auth._id })
      .select('lunanewyear.egg')
      .populate({ path: 'lunanewyear.egg.1.item', select: 'type item_image item_name' })
      .populate({ path: 'lunanewyear.egg.2.item', select: 'type item_image item_name' })
      .populate({ path: 'lunanewyear.egg.3.item', select: 'type item_image item_name' })
      .populate({ path: 'lunanewyear.egg.4.item', select: 'type item_image item_name' })
      .populate({ path: 'lunanewyear.egg.5.item', select: 'type item_image item_name' })
    }

    const config = await DB.LunaEgg.findOne({}).select('price')
    if(!config) throw 'Không tìm thấy cấu hình'

    return resp(event, { result: { user: user ? user.lunanewyear.egg : null, config: config }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})