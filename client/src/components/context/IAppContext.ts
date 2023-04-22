'use client'
import { Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client'

export interface IAppContext {
  isLogged: boolean
  setIsLogged: Dispatch<SetStateAction<boolean>>
  socket: Socket | undefined
}
