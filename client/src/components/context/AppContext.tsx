/* eslint-disable prettier/prettier */
import { createContext } from 'react'
import { IAppContext } from './IAppContext'

export const AppContext = createContext<IAppContext>({
  isLogged: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLogged: () => { },
  socket: undefined
})