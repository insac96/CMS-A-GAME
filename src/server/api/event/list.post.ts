const typeList = [
  'login.month', 'login.total', 
  'pay.total.money', 'pay.day.money', 'pay.month.money',
  'spend.total.coin', 'spend.day.coin', 'spend.month.coin'
]

export default defineEventHandler(async (event) => {
  try {
    const { type } = await readBody(event)
    if(!type || !typeList.includes(type)) throw 'Kiểu sự kiện không hỗ trợ'

    const list = await DB.Event
    .aggregate([
      { $match: { type: type, display: 1 } },
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
          need: 1, 
          type: 1,
          gift: {
            $map: {
              input: '$giftdata',
              in: {
                _id: '$$this._id',
                name: '$$this.item_name',
                image: '$$this.item_image',
                type: '$$this.type',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$gift', { $indexOfArray: ['$gift.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          }
        } 
      },
      { $sort: { need: 1 } },
    ])

    for (let i = 0; i < list.length; i++) {
      list[i].status = await getEventActive(event, list[i], type)
    }

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})