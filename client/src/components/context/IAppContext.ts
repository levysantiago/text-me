'use client'
import { Dispatch, SetStateAction } from 'react'

export interface IAppContext {
  accessToken: string
  setAccessToken: Dispatch<SetStateAction<string>>
}
