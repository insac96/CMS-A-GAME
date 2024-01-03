import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'
import type { IAuth } from '~~/types'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, range } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = dayjs(range['start']).startOf('date')
      const end : any = dayjs(range['end']).endOf('date')
      match['time'] = { $gte: start['$d'], $lte: end['$d'] }
    }

    const payment = await DB.Payment.aggregate([
      {
        $lookup: {
          from: "gates",
          localField: "gate",
          foreignField: "_id",
          pipeline: [{
            $project: { type: 1 }
          }],
          as: "gate"
        }
      },
      { $unwind: { path: "$gate" }},
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: {
            waiting: { $cond: [{$eq: ['$status', 0]} , 1, 0] },
            success: { $cond: [{$eq: ['$status', 1]} , 1, 0] },
            refuse: { $cond: [{$eq: ['$status', 2]} , 1, 0] },
          },
          money: {
            total: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            card: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 1] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
            bank: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 2] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
            momo: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 3] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
          }
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          count_total: { $sum: 1 },
          count_waiting: { $sum: '$count.waiting' },
          count_success: { $sum: '$count.success' },
          count_refuse: { $sum: '$count.refuse' },
          money_total: { $sum: '$money.total' },
          money_card: { $sum: '$money.card' },
          money_bank: { $sum: '$money.bank' },
          money_momo: { $sum: '$money.momo' },
        }
      },
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
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
      list: payment[0].list ? payment[0].list : [],
      total: payment[0].pagination ? (payment[0].pagination[0] ? payment[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})