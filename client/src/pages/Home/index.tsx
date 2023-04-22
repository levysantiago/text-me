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
