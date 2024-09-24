import 'reflect-metadata'
import fastify from 'fastify'
import './providers'
import { loginHook } from './hooks/on-ready/login.hook'
import { connectServicesHook } from './hooks/on-ready/connect-services.hook'
import { disconnectServicesHook } from './hooks/on-close/disconnect-services.hook'
import { connectSocketServiceHook } from './hooks/on-ready/connect-socket-service.hook'

const server = fastify()

server.addHook('onReady', loginHook)
server.addHook('onReady', connectServicesHook)
server.addHook('onReady', connectSocketServiceHook)
server.addHook('onClose', disconnectServicesHook)

server.listen({ port: 3001, host: 'localhost' }, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
