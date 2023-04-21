'use client'
import { useContext, useState } from 'react'
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
import { loginService } from 'services/loginService'
import { AppContext } from 'components/context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { setAccessToken } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit() {
    try {
      const responseData = await loginService({ email, password })
      setAccessToken(responseData.data.access_token)
      navigate('/')
    } catch (e: any) {
      console.log(e.response.data)
    }
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
