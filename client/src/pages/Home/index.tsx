/* eslint-disable no-undef */
import { useContext, useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import {
  AddFriendButtonsContainer,
  AddFriendContainer,
  AddFriendContent,
  Container,
  FriendEmailInputContainer,
  FriendEmailInputTitle,
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
import { Input } from 'components/Input'
import { DefaultButton } from 'components/buttons/DefaultButton'
import { addFriendService } from 'services/addFriendService'
import { HollowButton } from 'components/buttons/HollowButton'

interface IFriendAmountOfUnseenMessages {
  [x: string]: IResume
}

function Home() {
  const navigate = useNavigate()
  const { isLogged, socket } = useContext(AppContext)
  const [friends, setFriends] = useState<IFriend[]>([])
  const [friendEmail, setFriendEmail] = useState<string>('')
  const [friendsAmountOfUnseenMessages, setfriendsAmountOfUnseenMessages] =
    useState<IFriendAmountOfUnseenMessages>({})

  async function fetchFriends() {
    const _friends = await getFriendsService()
    const _friendsAmountOfUnseenMessages =
      await getAmountOfUnseenMessagesService()

    setFriends(_friends)
    setfriendsAmountOfUnseenMessages(_friendsAmountOfUnseenMessages)
  }

  async function sumbitAddFriend() {
    if (!friendEmail) alert("Please, type your friend's email.")

    try {
      await addFriendService({ friendEmail })
      setFriendEmail('')
      handleOnCloseAddFriend()
      fetchFriends()
    } catch (e) {
      console.log(e)
    }
  }

  function handleOnClickAddFriend() {
    const addFriendContainer = document.getElementById('add-friend-container')
    const addFriendContent = document.getElementById('add-friend-content')

    if (addFriendContainer && addFriendContent) {
      addFriendContainer.style.height = '40%'
      setTimeout(() => {
        addFriendContent.style.visibility = 'visible'
      }, 250)
    }
  }

  function handleOnCloseAddFriend() {
    const addFriendContainer = document.getElementById('add-friend-container')
    const addFriendContent = document.getElementById('add-friend-content')

    if (addFriendContainer && addFriendContent) {
      addFriendContent.style.visibility = 'hidden'
      addFriendContainer.style.height = '0px'
    }
  }

  useEffect(() => {
    if (!isLogged) {
      navigate('/login')
    }

    fetchFriends()
  }, [isLogged])

  async function eventListener({
    fromUserId,
    toUserId,
    content,
  }: IReceivedMessageData) {
    const isThisMyFriend = friends.filter((friend) => {
      return friend.id === fromUserId
    })[0]
    if (!isThisMyFriend) {
      await fetchFriends()
    }

    setfriendsAmountOfUnseenMessages((friendsAmountOfUnseenMessages) => {
      const _friendsAmountOfUnseenMessages = {
        ...friendsAmountOfUnseenMessages,
      }
      _friendsAmountOfUnseenMessages[fromUserId].unseenMessages += 1
      _friendsAmountOfUnseenMessages[fromUserId].lastMessage = content
      return _friendsAmountOfUnseenMessages
    })
  }

  useEffect(() => {
    if (socket) {
      emitter.on('handleCreatedMessage', eventListener)
    }

    return () => {
      emitter.removeAllListeners()
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
              <HeaderButton
                title="Add friend"
                onClick={handleOnClickAddFriend}
              />
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
        <AddFriendContainer id="add-friend-container">
          <AddFriendContent id="add-friend-content">
            <FriendEmailInputContainer>
              <FriendEmailInputTitle>
                Type your friend's email:
              </FriendEmailInputTitle>
              <Input
                placeholder="john@gmail.com"
                type="email"
                value={friendEmail}
                onChange={(e) => {
                  setFriendEmail(e.target.value)
                }}
              />
            </FriendEmailInputContainer>

            <AddFriendButtonsContainer>
              <HollowButton title="Cancel" onClick={handleOnCloseAddFriend} />
              <DefaultButton title="Add Friend" onClick={sumbitAddFriend} />
            </AddFriendButtonsContainer>
          </AddFriendContent>
        </AddFriendContainer>
      </WebsiteContainer>
    </>
  )
}

export default Home
