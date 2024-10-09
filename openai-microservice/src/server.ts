import 'reflect-metadata'
import '@shared/container/providers'
import fastify from 'fastify'
import { loginHook } from './shared/infra/hooks/on-ready/login.hook'
import { disconnectServicesHook } from './shared/infra/hooks/on-close/disconnect-services.hook'
import { connectSocketServiceHook } from './shared/infra/hooks/on-ready/connect-socket-service.hook'
import { connectQueueServiceHook } from './shared/infra/hooks/on-ready/connect-queue-service.hook'

const server = fastify()

server.addHook('onReady', loginHook)
server.addHook('onReady', connectQueueServiceHook)
server.addHook('onReady', connectSocketServiceHook)
server.addHook('onClose', disconnectServicesHook)

server.listen({ port: 3001, host: 'localhost' }, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
