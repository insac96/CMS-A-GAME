import type { IAuth } from '~~/types'

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
      const start : any = randDate(range['start'], 'date').start
      const end : any = randDate(range['end'], 'date').end
      match['time'] = { $gte: start['$d'], $lte: end['$d'] }
    }

    const signin = await DB.UserLogin.aggregate([
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          }
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          count: { $count: {} },
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
      list: signin[0].list ? signin[0].list : [],
      total: signin[0].pagination ? (signin[0].pagination[0] ? signin[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})