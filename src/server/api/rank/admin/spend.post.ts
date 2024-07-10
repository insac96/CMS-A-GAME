import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, range, server } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!range) throw 'Dữ liệu thời gian sai'

    const match : any = { }
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    const firstMatch : any = {}
    if(!!server) firstMatch['server'] = server

    const data = await DB.ShopHistory.aggregate([
      { $match: firstMatch },
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
          },
          user: 1,
          price: 1,
        }
      },
      {
        $lookup: {
          from: "shop_box_histories",
          localField: "user",
          foreignField: "user",
          pipeline: [{
            $project: { price: 1 }
          }],
          as: "packHistory"
        }
      },
      {
        $project: {
          createdAt: 1,
          timeformat: 1,
          user: 1,
          priceItem: '$price',
          pricePack: { $sum : '$packHistory.price' }
        }
      },
      {
        $group: {
          _id: {
            timeformat: '$timeformat',
            user: '$user',
            pricePack: '$pricePack'
          },
          time: { $min: '$createdAt' },
          price: { $sum: '$priceItem' },
        }
      },
      { $match: match },
      {
        $group: {
          _id: {
            user: '$_id.user',
            pricePack: '$_id.pricePack'
          },
          value: { $sum: '$price' },
        }
      },
      {
        $project: {
          _id: '$_id.user',
          value: { $add : [ "$value", "$_id.pricePack" ] }
        }
      },
      { $match: { value: { $gt: 0 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 }
          }],
          as: "user"
        }
      },
      { $unwind: { path: "$user" }},
      {
        $facet: {
          list: [
            { $sort: { value: -1 } },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: data[0].list ? data[0].list : [],
      total: data[0].pagination ? (data[0].pagination[0] ? data[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})