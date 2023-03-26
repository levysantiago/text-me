import { useEffect, useState } from "react";
import { createAvatar } from "../../lib/create-avatar";
import {
  ContactName,
  Container,
  ContentContainer,
  Time,
  MessagePreview,
  ProfileImage,
} from "./styles";

interface IMessageItemProps {
  contactName: string;
  onClick?: () => void;
}

export function MessageItem({ onClick, contactName }: IMessageItemProps) {
  const [avatar, setAvatar] = useState(createAvatar(contactName));

  return (
    <Container type="button" onClick={onClick}>
      <ProfileImage src={avatar} alt="avatar" />
      <ContentContainer>
        <ContactName>{contactName}</ContactName>
        <div style={{ display: "flex", flex: "2" }}>
          <MessagePreview>
            Message aasldkjasldj alskdjald jaskl jalsk jasl aldkasjd laksjdlas
            ja
          </MessagePreview>
        </div>
      </ContentContainer>

      <Time>11/11/11</Time>
    </Container>
  );
}
