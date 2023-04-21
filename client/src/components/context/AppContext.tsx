'use client'
/* eslint-disable prettier/prettier */
import { createContext, ReactNode, useState } from 'react'
import { IAppContext } from './IAppContext'

export const AppContext = createContext<IAppContext>({
  accessToken: '',
  setAccessToken: () => { },
})

interface IAppContextProviderProps {
  children: ReactNode
}

export function AppContextProvider({ children }: IAppContextProviderProps) {
  const [accessToken, setAccessToken] = useState('')

  // useEffect(() => {
  //   console.log(accessToken)
  // }, [accessToken])

  return (
    <AppContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AppContext.Provider>
  )
}
