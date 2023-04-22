/* eslint-disable no-undef */
import { useContext, useEffect, useState } from 'react'
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
import { IFriend, getFriendsService } from 'services/getFriendsService'
import { AppContext } from 'components/context/AppContext'

function Home() {
  const navigate = useNavigate()
  const { isLogged } = useContext(AppContext)
  const [friends, setFriends] = useState<IFriend[]>([])

  async function fetchFriends() {
    const _friends = await getFriendsService()

    setFriends(_friends)
  }

  useEffect(() => {
    if (!isLogged) {
      navigate('/login')
    }

    fetchFriends()
  }, [isLogged])

  // useEffect(() => {
  //   checkLogin().then(() => {
  //     fetchFriends()
  //     const accessToken = localStorage.getItem('access_token')
  //     const _socket = io('http://localhost:3333', {
  //       query: { access_token: accessToken },
  //     })
  //     setSocket(_socket)

  //     _socket.on(
  //       'receivedMessage',
  //       ({ fromUserId, content }: IReceivedMessageData) => {
  //         console.log({ fromUserId, content })
  //       },
  //     )
  //   })
  // }, [])

  // useEffect(() => {
  //   if (socket && friends.length) {
  //     const accessToken = localStorage.getItem('access_token')
  //     socket.emit('newMessage', {
  //       to: friends[0].id,
  //       content: 'asd',
  //       access_token: accessToken,
  //     })
  //   }
  // }, [socket, friends])

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
            {friends.map((friend, index) => {
              return (
                <MessageItem
                  key={`message-item-${index}`}
                  contactName={friend.name}
                  onClick={() => {
                    navigate({
                      pathname: `/chat`,
                      search: `${createSearchParams({
                        friendName: friend.name,
                        friendId: friend.id,
                      })}`,
                    })
                  }}
                />
              )
            })}
          </MessagesList>
        </Container>
      </WebsiteContainer>
    </>
  )
}

export default Home
