/* eslint-disable no-undef */
import { useContext, useEffect, useState } from 'react'
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
import { AppContext } from 'components/context/AppContext'
import { IMessage, getMessagesService } from 'services/getMessagesService'

interface IReceivedMessageData {
  content: string
  fromUserId: string
  toUserId: string
}

export default function Chat() {
  const navigate = useNavigate()
  const { socket, isLogged } = useContext(AppContext)
  const [avatar, setAvatar] = useState('')
  const [friendName, setFriendName] = useState('')
  const [friendId, setFriendId] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    if (!isLogged) {
      navigate('/login')
    }

    const _friendName = new URL(window.location.href).searchParams.get(
      'friendName',
    )
    const _friendId = new URL(window.location.href).searchParams.get('friendId')

    if (
      !_friendName ||
      typeof _friendName !== 'string' ||
      !_friendId ||
      typeof _friendId !== 'string'
    ) {
      navigate('/')
      return
    }

    setFriendName(_friendName)
    setFriendId(_friendId)
    setAvatar(createAvatar(_friendName))
    fetchMessages()
  }, [friendId, isLogged])

  async function fetchMessages() {
    const _messages = await getMessagesService({ fromUserId: friendId })
    setMessages(_messages)
  }

  function submitMessage() {
    if (!messageContent || !messageContent.length) {
      return
    }

    const accessToken = localStorage.getItem('access_token')

    socket?.emit('newMessage', {
      to: friendId,
      content: messageContent,
      access_token: accessToken,
    })

    setMessageContent('')
  }

  useEffect(() => {
    const chatMessagesContainer = document.getElementById(
      'chat-messages-container',
    )
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (socket) {
      socket.on(
        'handleCreatedMessage',
        ({ fromUserId, toUserId, content }: IReceivedMessageData) => {
          setMessages((messages) => [
            ...messages,
            {
              fromUserId,
              toUserId,
              content,
            },
          ])

          console.log(fromUserId)
        },
      )
    }
  }, [socket])

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
            <ContactName>{friendName}</ContactName>
          </Header>

          <ChatMessagesContainer id="chat-messages-container">
            {messages.map((message, index) => {
              return (
                <MessageBlockContainer
                  isUserMessage={friendId === message.toUserId}
                  key={`message-block-${index}`}
                >
                  <MessageBlock isUserMessage={friendId === message.toUserId}>
                    <MessageBlockContent>{message.content}</MessageBlockContent>
                  </MessageBlock>
                </MessageBlockContainer>
              )
            })}
          </ChatMessagesContainer>

          <InputMessageContainer>
            <InputMessage
              value={messageContent}
              type="text"
              onChange={(e) => {
                setMessageContent(e.target.value)
              }}
            />
            <SendIconContainer type="button" onClick={submitMessage}>
              <SendIcon src={sendIcon} alt={'Send icon'} />
            </SendIconContainer>
          </InputMessageContainer>
        </Container>
      </WebsiteContainer>
    </>
  )
}
