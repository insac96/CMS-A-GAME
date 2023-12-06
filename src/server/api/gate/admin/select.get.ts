export default defineEventHandler(async (event) => {
  try {
    const gates = await DB.Gate.find().select('name')
    return resp(event, { result: gates })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})