/* eslint-disable prettier/prettier */
import { createContext } from 'react'
import { IAppContext } from './IAppContext'

export const AppContext = createContext<IAppContext>({
  isLogged: false,
  setIsLogged: () => { },
  socket: undefined
})