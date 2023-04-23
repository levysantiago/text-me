/* eslint-disable no-undef */
import { ReactNode, useEffect, useState } from 'react'
import { AppContext } from './AppContext'
import { checkLoginService } from 'services/checkLoginService'
import { Socket, io } from 'socket.io-client'
import { emitter } from 'lib/event-emitter'

interface IAppContextProviderProps {
  children: ReactNode
}

export function AppContextProvider({ children }: IAppContextProviderProps) {
  const [isLogged, setIsLogged] = useState(false)
  const [socket, setSocket] = useState<Socket>()

  async function checkLogin() {
    try {
      await checkLoginService()
      setIsLogged(true)

      const accessToken = localStorage.getItem('access_token')
      const _socket = io('http://localhost:3333', {
        query: { access_token: accessToken as string },
      })

      _socket.on(
        'handleCreatedMessage',
        ({ fromUserId, toUserId, content }: any) => {
          emitter.emit('handleCreatedMessage', {
            fromUserId,
            toUserId,
            content,
          })
        },
      )
      setSocket(_socket)
    } catch (e) {
      setIsLogged(false)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <AppContext.Provider value={{ isLogged, setIsLogged, socket }}>
      {children}
    </AppContext.Provider>
  )
}
