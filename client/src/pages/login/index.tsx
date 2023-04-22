/* eslint-disable no-undef */
import { useContext, useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'components/context/AppContext'

export default function Login() {
  const { isLogged, setIsLogged } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isLogged) {
      navigate('/')
    }
  }, [isLogged])

  async function handleSubmit() {
    try {
      const responseData = await loginService({ email, password })
      localStorage.setItem('access_token', responseData.data.access_token)
      setIsLogged(true)
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
