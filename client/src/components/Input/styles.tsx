import styled from '@emotion/styled'

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
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;

  ::placeholder {
    color: #454d5a;
    font-size: 14px;
  }
`
