'use client'
import { ReactNode, useState } from 'react'
import { AppContext } from './AppContext'

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
