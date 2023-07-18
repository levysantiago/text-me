import axios from 'axios'

export const textmeServer = axios.create({
  baseURL: 'http://localhost:3333/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
  withCredentials: true,
})
