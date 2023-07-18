import 'reflect-metadata'
import fastify from 'fastify'
import './providers'
import { loginHook } from './hooks/login-hook'

const server = fastify()

server.addHook('onReady', loginHook)

server.listen({ port: 3001, host: 'localhost' }, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
