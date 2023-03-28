import { useEffect } from 'react'
import { createSearchParams } from 'react-router-dom'
import { HeaderButton } from '../components/buttons/HeaderButton'
import { MessageItem } from '../components/MessageItem'
import {
  Container,
  Header,
  HeaderButtonsContainer,
  MessagesList,
  Title,
  TitleContainer,
} from './styles'
// import io, { Socket } from 'socket.io-client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { WebsiteContainer } from '@/templates/website-container'

function Home() {
  const router = useRouter()
  // const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    // const _socket = io("http://localhost:3333")
    // console.log(_socket);
    // setSocket(_socket)
  }, [])

  // useEffect(() => {
  //   socket?.emit('newMessage', { content: 'asd' })
  // }, [socket])

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
            <TitleContainer>
              <Title>TextMe</Title>
            </TitleContainer>

            <HeaderButtonsContainer>
              <HeaderButton title="Messages" isSelected />
              <HeaderButton title="Add contact" />
            </HeaderButtonsContainer>
          </Header>

          <MessagesList>
            <MessageItem
              contactName="John Duo"
              onClick={() => {
                router.push({
                  pathname: `/chat`,
                  search: `${createSearchParams({ contactName: 'John Duo' })}`,
                })
              }}
            />
            <MessageItem contactName="John Duo2" />
            <MessageItem contactName="John Duo3" />
            <MessageItem contactName="John Duo4" />
            <MessageItem contactName="John Duo5" />
            <MessageItem contactName="John Duo6" />
            <MessageItem contactName="John Duo7" />
            <MessageItem contactName="John Duo8" />
            <MessageItem contactName="John Duo9" />
            <MessageItem contactName="John Duo10" />
            <MessageItem contactName="John Duo11" />
          </MessagesList>
        </Container>
      </WebsiteContainer>
    </>
  )
}

export default Home
