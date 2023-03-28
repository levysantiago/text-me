import styled from '@emotion/styled'
import { Roboto } from 'next/font/google'

const robotoBold = Roboto({ weight: '700', subsets: ['latin'] })

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`

export const TitleContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
`

export const Title = styled.h1`
  font-family: ${robotoBold.style.fontFamily};
  font-weight: 700;
  font-size: 25px;
  color: #8a4de6;
`

export const Header = styled.div`
  padding: 0px 20px;
`

export const HeaderButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
  overflow: scroll;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

export const MessagesList = styled.div`
  overflow-x: hidden;
  height: 100%;
`
