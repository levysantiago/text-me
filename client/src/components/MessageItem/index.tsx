import { useState } from "react";
import {
  ContactName,
  Container,
  ContentContainer,
  MessagePreview,
  MessagesAmountContainer,
  MessagesAmountText,
  ProfileImage,
} from "./styles";
import { createAvatar } from "lib/create-avatar";

interface IMessageItemProps {
  contactName: string;
  messageContent: string;
  unseenMessagesAmount?: number;
  onClick?: () => void;
}

export function MessageItem({
  onClick,
  contactName,
  messageContent,
  unseenMessagesAmount,
}: IMessageItemProps) {
  const [avatar] = useState(createAvatar(contactName));

  return (
    <Container type="button" onClick={onClick}>
      <ProfileImage src={avatar} alt="avatar" />
      <ContentContainer>
        <ContactName>{contactName}</ContactName>
        <div style={{ display: "flex", flex: "2" }}>
          <MessagePreview>{messageContent}</MessagePreview>
        </div>
      </ContentContainer>

      {unseenMessagesAmount ? (
        <MessagesAmountContainer>
          <MessagesAmountText>{unseenMessagesAmount}</MessagesAmountText>
        </MessagesAmountContainer>
      ) : null}
    </Container>
  );
}
