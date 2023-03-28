import styled from '@emotion/styled'
import { Roboto } from 'next/font/google'

const robotoBold = Roboto({ weight: '700', subsets: ['latin'] })

export const ButtonContainer = styled.button`
  padding: 10px 20px;
  background-color: #8a4de6;
  border: none;
  border-radius: 100px;
  width: 100%;
`

export const Title = styled.span`
  font-family: ${robotoBold.style.fontFamily};
  font-weight: ${robotoBold.style.fontWeight};
  font-size: 15px;
`
