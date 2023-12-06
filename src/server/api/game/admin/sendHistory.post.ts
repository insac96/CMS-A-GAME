export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, from, to } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!from){
      const users = await DB.User.find({
        username : { $regex : from.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['from'] = {
        $in: users.map(i => i._id)
      }
    }
    if(!!to){
      const users = await DB.User.find({
        username : { $regex : to.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['to'] = {
        $in: users.map(i => i._id)
      }
    }

    const list = await DB.GameSendHistory
    .find(match)
    .populate({ path: 'from', select: 'username' })
    .populate({ path: 'to', select: 'username' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameSendHistory.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})