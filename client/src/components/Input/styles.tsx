import styled from '@emotion/styled'
import { Roboto } from 'next/font/google'

const robotoRegular = Roboto({ weight: '400', subsets: ['latin'] })

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

export const InputItem = styled.input`
  padding: 15px 20px;
  border-radius: 100px;
  background-color: #0d1015;
  border: none;
  color: #fafafa;
  font-family: ${robotoRegular.style.fontFamily};
  font-weight: ${robotoRegular.style.fontWeight};
  font-size: 14px;

  ::placeholder {
    color: #454d5a;
    font-size: 14px;
  }
`
