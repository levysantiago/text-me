import { env } from '@src/env'
import axios from 'axios'

export const textmeServer = axios.create({
  baseURL: `${env.WEBSOCKET_SERVER}/api/`,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
  withCredentials: true,
})
