const typeList = [
  'login.month', 'login.total',
  'pay.total.money', 'pay.day.money', 'pay.month.money',
  'spend.total.coin', 'spend.day.coin', 'spend.month.coin'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, type } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!type || !typeList.includes(type)) throw 'Kiểu sự kiện không hỗ trợ'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { type: type }

    const list = await DB.Event
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "items",
          localField: "gift.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, type: 1 },
          }],
          as: "giftdata"
        }
      },
      { 
        $project: {
          need: 1, display: 1, updatedAt: 1,
          gift: {
            $map: {
              input: '$giftdata',
              as: 'item',
              in: {
                _id: '$$item._id',
                name: '$$item.item_name',
                image: '$$item.item_image',
                type: '$$item.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$gift', { $indexOfArray: ['$giftdata._id', '$$item._id']} ]
                    }
                  }
                },
              }
            }
          }
        } 
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Event.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})