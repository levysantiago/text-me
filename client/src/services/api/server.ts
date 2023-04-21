import axios from 'axios'

const server = axios.create({
  baseURL: 'http://localhost:3333/api/',
  timeout: 1000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default server
