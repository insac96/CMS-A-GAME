import { Server as SocketServer } from 'socket.io'

export default (io : SocketServer) => {
  io.on('connection', (socket : any) => {
    socket.on('get-online', () => {
      global.SocketData.online++
      io.emit('online', global.SocketData.online)
    })

    socket.on('disconnect', () => {
      global.SocketData.online--
      io.emit('online', global.SocketData.online)
    })
  })

  global.IO = io
}