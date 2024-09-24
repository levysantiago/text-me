import axios from 'axios'

const server = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
  timeout: 1000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default server
