import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, user } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: !!user ? user : auth._id }

    const list = await DB.WheelHistory
    .find(match)
    .select('server item amount createdAt')
    .populate({ path: 'item', select: 'item_name item_image type' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.WheelHistory.count(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})