import 'reflect-metadata'
import fastify from 'fastify'
import './providers'
// import { io } from 'socket.io-client'
import { loginMiddleware } from './middlewares/login-middleware'

const server = fastify()

server.addHook('onReady', loginMiddleware)

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)

  // const socket = io('http://localhost:3333', {
  //   query: { access_token: '' },
  // })
  // console.log(socket)
})
