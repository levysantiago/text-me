import { useEffect, useState } from 'react'
import { createAvatar } from '../../lib/create-avatar'
import arrowLeftIcon from '@/assets/arrow-left.svg'
import sendIcon from '@/assets/send.svg'
import {
  BackIcon,
  BackIconContainer,
  ChatMessagesContainer,
  ContactName,
  Container,
  Header,
  InputMessage,
  InputMessageContainer,
  MessageBlock,
  MessageBlockContainer,
  MessageBlockContent,
  ProfileImage,
  SendIcon,
  SendIconContainer,
} from './styles'
import { useRouter } from 'next/router'
import { WebsiteContainer } from '@/templates/website-container'
import Head from 'next/head'

export default function Chat() {
  const router = useRouter()
  const [avatar, setAvatar] = useState('')
  const [contactName, setContactName] = useState('')

  useEffect(() => {
    const _contactName = new URL(window.location.href).searchParams.get(
      'contactName',
    )

    if (!_contactName || typeof _contactName !== 'string') {
      router.push('/')
      return
    }

    setContactName(_contactName)
    setAvatar(createAvatar(_contactName))
  }, [])

  return (
    <>
      <Head>
        <title>TextMe</title>
        <meta name="description" content="TextMe chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WebsiteContainer>
        <Container>
          <Header>
            <BackIconContainer
              type="button"
              onClick={() => {
                router.push('/')
              }}
            >
              <BackIcon src={arrowLeftIcon.src} alt={'Back icon'} />
            </BackIconContainer>
            <ProfileImage src={avatar} alt="Avatar image" />
            <ContactName>{contactName}</ContactName>
          </Header>

          <ChatMessagesContainer>
            <MessageBlockContainer>
              <MessageBlock>
                <MessageBlockContent>Olá</MessageBlockContent>
              </MessageBlock>
            </MessageBlockContainer>

            <MessageBlockContainer isUserMessage>
              <MessageBlock>
                <MessageBlockContent>Olá</MessageBlockContent>
              </MessageBlock>
            </MessageBlockContainer>

            <MessageBlockContainer>
              <MessageBlock>
                <MessageBlockContent>Tudo bom?</MessageBlockContent>
              </MessageBlock>
            </MessageBlockContainer>
          </ChatMessagesContainer>

          <InputMessageContainer>
            <InputMessage />
            <SendIconContainer type="button">
              <SendIcon src={sendIcon.src} alt={'Send icon'} />
            </SendIconContainer>
          </InputMessageContainer>
        </Container>
      </WebsiteContainer>
    </>
  )
}
