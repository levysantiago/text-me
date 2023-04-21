'use client'
import { useState } from 'react'
import {
  ButtonContainer,
  InputsTitle,
  InputTitleContainer,
  Title,
  TitleContainer,
} from './styles'
import { Input } from 'components/Input'
import { DefaultButton } from 'components/buttons/DefaultButton'
import { WebsiteContainer } from 'templates/WebsiteContainer'

export default async function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit() {
    // appCookies.set('access_token', 'asd')
    // console.log(appCookies)
    // console.log(setAccessToken)
    // console.log(accessToken)
    // const responseData = await loginService({ email, password })
    // console.log(responseData)
    // setAccessToken(responseData.data.access_token)
  }

  return (
    <>
      <WebsiteContainer>
        <TitleContainer>
          <Title>TextMe</Title>
        </TitleContainer>

        <InputTitleContainer>
          <InputsTitle color="#fafafa">Sign in</InputsTitle>
          <Input
            placeholder="Email"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <ButtonContainer>
            <DefaultButton title="Sign in" onClick={handleSubmit} />
          </ButtonContainer>
        </InputTitleContainer>
      </WebsiteContainer>
    </>
  )
}
