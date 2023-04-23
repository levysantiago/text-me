import { useState } from 'react'
import {
  ContactName,
  Container,
  ContentContainer,
  MessagePreview,
  MessagesAmountContainer,
  MessagesAmountText,
  ProfileImage,
} from './styles'
import { createAvatar } from 'lib/create-avatar'

interface IMessageItemProps {
  contactName: string
  unseenMessagesAmount?: number
  onClick?: () => void
}

export function MessageItem({
  onClick,
  contactName,
  unseenMessagesAmount,
}: IMessageItemProps) {
  const [avatar] = useState(createAvatar(contactName))

  return (
    <Container type="button" onClick={onClick}>
      <ProfileImage src={avatar} alt="avatar" />
      <ContentContainer>
        <ContactName>{contactName}</ContactName>
        <div style={{ display: 'flex', flex: '2' }}>
          <MessagePreview>
            Message aasldkjasldj alskdjald jaskl jalsk jasl aldkasjd laksjdlas
            ja
          </MessagePreview>
        </div>
      </ContentContainer>

      {unseenMessagesAmount ? (
        <MessagesAmountContainer>
          <MessagesAmountText>{unseenMessagesAmount}</MessagesAmountText>
        </MessagesAmountContainer>
      ) : null}
    </Container>
  )
}
