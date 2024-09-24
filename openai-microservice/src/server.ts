import 'reflect-metadata'
import fastify from 'fastify'
import './providers'
import { loginHook } from './hooks/login.hook'
import { startClientSocketHook } from './hooks/start-client-socket.hook'
import { disconnectServicesHook } from './hooks/disconnect-services.hook'
import { connectServicesHook } from './hooks/connect-services.hook'

const server = fastify()

server.addHook('onReady', loginHook)
server.addHook('onReady', connectServicesHook)
server.addHook('onReady', startClientSocketHook)
server.addHook('onClose', disconnectServicesHook)

server.listen({ port: 3001, host: 'localhost' }, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
