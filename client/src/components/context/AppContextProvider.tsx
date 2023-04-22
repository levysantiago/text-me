/* eslint-disable no-undef */
import { ReactNode, useEffect, useState } from 'react'
import { AppContext } from './AppContext'
import { checkLoginService } from 'services/checkLoginService'
import { Socket, io } from 'socket.io-client'

interface IAppContextProviderProps {
  children: ReactNode
}

export function AppContextProvider({ children }: IAppContextProviderProps) {
  const [isLogged, setIsLogged] = useState(false)
  const [, setSocket] = useState<Socket>()

  async function checkLogin() {
    try {
      await checkLoginService()
      setIsLogged(true)

      const accessToken = localStorage.getItem('access_token')
      const _socket = io('http://localhost:3333', {
        query: { access_token: accessToken },
      })
      setSocket(_socket)
      // _socket.on(
      //   'receivedMessage',
      //   ({ fromUserId, content }: IReceivedMessageData) => {
      //     console.log({ fromUserId, content })
      //   },
      // )
    } catch (e) {
      setIsLogged(false)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  // useEffect(() => {
  //   console.log(accessToken)
  // }, [accessToken])

  return (
    <AppContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AppContext.Provider>
  )
}
