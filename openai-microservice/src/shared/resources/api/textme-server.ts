import { env } from '@shared/resources/env'
import axios from 'axios'

export const textmeServer = axios.create({
  baseURL: `${env.WEBSOCKET_SERVER}/api/`,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
  withCredentials: true,
})
