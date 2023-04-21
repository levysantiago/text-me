import { useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Header,
  HeaderButtonsContainer,
  MessagesList,
  Title,
  TitleContainer,
} from './styles'
import { WebsiteContainer } from 'templates/WebsiteContainer'
import { HeaderButton } from 'components/buttons/HeaderButton'
import { MessageItem } from 'components/MessageItem'
// import io, { Socket } from 'socket.io-client'

function Home() {
  const navigate = useNavigate()
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
                navigate({
                  pathname: `/chat`,
                  search: `${createSearchParams({
                    contactName: 'John Duo',
                  })}`,
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
