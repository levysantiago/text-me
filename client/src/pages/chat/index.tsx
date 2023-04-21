import { useEffect, useState } from 'react'
import arrowLeftIcon from 'assets/arrow-left.svg'
import sendIcon from 'assets/send.svg'
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
import { useNavigate } from 'react-router-dom'
import { createAvatar } from 'lib/create-avatar'
import { WebsiteContainer } from 'templates/WebsiteContainer'

export default function Chat() {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState('')
  const [contactName, setContactName] = useState('')

  useEffect(() => {
    const _contactName = new URL(window.location.href).searchParams.get(
      'contactName',
    )

    if (!_contactName || typeof _contactName !== 'string') {
      navigate('/')
      return
    }

    setContactName(_contactName)
    setAvatar(createAvatar(_contactName))
  }, [])

  return (
    <>
      <WebsiteContainer>
        <Container>
          <Header>
            <BackIconContainer
              type="button"
              onClick={() => {
                navigate('/')
              }}
            >
              <BackIcon src={arrowLeftIcon} alt={'Back icon'} />
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
              <SendIcon src={sendIcon} alt={'Send icon'} />
            </SendIconContainer>
          </InputMessageContainer>
        </Container>
      </WebsiteContainer>
    </>
  )
}
