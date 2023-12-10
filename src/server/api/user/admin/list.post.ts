export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!search.key){
      if(search.by == 'USER') match['username'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
      if(search.by == 'IP') match['login.last_ip'] = { $regex : search.key, $options : 'i' }
    }

    const list = await DB.User
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "levels",
          localField: "level",
          foreignField: "_id",
          pipeline: [{
            $project: { number: 1 }
          }],
          as: "level"
        }
      },
      { $unwind: { path: "$level" } },
      { 
        $project: {
          username: 1, 
          email: 1,
          phone: 1,
          level: '$level.number',
          coin: '$currency.coin',
          wheel: '$currency.wheel',
          notify: '$currency.notify',
          pay: '$pay.total.money',
          spend: '$spend.total.coin',
          login: '$login.total',
          ip: '$login.last_ip',
          pay_data: '$pay',
          spend_data: '$spend',
          wheel_data: '$wheel',
          dice_data: '$dice',
          login_data: '$login',
          type: 1,
          block: 1,
          createdAt: 1
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.User.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})