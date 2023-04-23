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
import { emitter } from 'lib/event-emitter'
import {
  IResume,
  getAmountOfUnseenMessagesService,
} from 'services/getAmountOfUnseenMessagesService'
import { IReceivedMessageData } from 'components/context/IAppContext'

interface IFriendAmountOfUnseenMessages {
  [x: string]: IResume
}

function Home() {
  const navigate = useNavigate()
  const { isLogged, socket } = useContext(AppContext)
  const [friends, setFriends] = useState<IFriend[]>([])
  const [friendsAmountOfUnseenMessages, setfriendsAmountOfUnseenMessages] =
    useState<IFriendAmountOfUnseenMessages>({})

  async function fetchFriends() {
    const _friends = await getFriendsService()
    const _friendsAmountOfUnseenMessages =
      await getAmountOfUnseenMessagesService()

    setFriends(_friends)
    setfriendsAmountOfUnseenMessages(_friendsAmountOfUnseenMessages)
  }

  useEffect(() => {
    if (!isLogged) {
      navigate('/login')
    }

    fetchFriends()
  }, [isLogged])

  useEffect(() => {
    if (socket) {
      emitter.on(
        'handleCreatedMessage',
        ({ fromUserId, toUserId, content }: IReceivedMessageData) => {
          setfriendsAmountOfUnseenMessages((friendsAmountOfUnseenMessages) => {
            const _friendsAmountOfUnseenMessages = {
              ...friendsAmountOfUnseenMessages,
            }
            _friendsAmountOfUnseenMessages[fromUserId].unseenMessages += 1
            _friendsAmountOfUnseenMessages[fromUserId].lastMessage = content
            return _friendsAmountOfUnseenMessages
          })
        },
      )
    }
  }, [socket])

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
                  unseenMessagesAmount={
                    friendsAmountOfUnseenMessages[friend.id].unseenMessages
                  }
                  messageContent={
                    friendsAmountOfUnseenMessages[friend.id].lastMessage
                  }
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
