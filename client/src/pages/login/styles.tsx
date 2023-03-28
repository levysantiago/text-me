import styled from '@emotion/styled'
import { Roboto } from 'next/font/google'

const robotoBold = Roboto({ weight: '700', subsets: ['latin'] })

export const InputTitleContainer = styled.div`
  padding: 0px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0px;
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const TitleContainer = styled.div`
  text-align: center;
`

export const Title = styled.h1`
  font-family: ${robotoBold.style.fontFamily};
  font-weight: ${robotoBold.style.fontWeight};
  font-size: 30px;
  color: #8a4de6;
`

export const InputsTitle = styled.h1`
  font-family: ${robotoBold.style.fontFamily};
  font-weight: ${robotoBold.style.fontWeight};
  font-size: 30px;
  color: #fafafa;
`
