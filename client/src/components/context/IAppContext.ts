'use client'
import { Dispatch, SetStateAction } from 'react'

export interface IAppContext {
  isLogged: boolean
  setIsLogged: Dispatch<SetStateAction<boolean>>
}
