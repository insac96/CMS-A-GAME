export default defineEventHandler(async (event) => {
  try {
    const os = await gameGetOS(event)
    return resp(event, { result: os })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})