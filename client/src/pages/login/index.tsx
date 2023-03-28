import { DefaultButton } from '@/components/buttons/DefaultButton'
import { Input } from '@/components/Input'
import { WebsiteContainer } from '@/templates/website-container'
import Head from 'next/head'
import { useState } from 'react'
import {
  ButtonContainer,
  InputsTitle,
  InputTitleContainer,
  Title,
  TitleContainer,
} from './styles'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit() {
    console.log(email)
    console.log(password)
  }

  return (
    <>
      <Head>
        <title>TextMe</title>
        <meta name="description" content="TextMe chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
