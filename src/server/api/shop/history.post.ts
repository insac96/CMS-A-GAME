export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort, user } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: !!user ? user : auth._id }

    const list = await DB.ShopHistory
    .find(match)
    .select('server item amount price createdAt')
    .populate({ path: 'item', select: 'item_name item_image type' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.ShopHistory.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})