import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createAvatar } from "../../lib/create-avatar";
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
} from "./styles";

export function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [avatar, setAvatar] = useState("");
  const [contactName, setContactName] = useState("");

  useEffect(() => {
    const _contactName = searchParams.get("contactName");

    if (!_contactName) {
      navigate("/");
      return;
    }

    setContactName(_contactName);
    setAvatar(createAvatar(_contactName));
  }, []);

  return (
    <Container>
      <Header>
        <BackIconContainer
          onClick={() => {
            navigate("/");
          }}
        >
          <BackIcon />
        </BackIconContainer>
        <ProfileImage src={avatar} alt="Avatar image" />
        <ContactName>{contactName}</ContactName>
      </Header>

      <ChatMessagesContainer>
        <MessageBlockContainer>
          <MessageBlock>
            <MessageBlockContent>Olá</MessageBlockContent>
          </MessageBlock>
        </MessageBlockContainer>

        <MessageBlockContainer isUserMessage>
          <MessageBlock>
            <MessageBlockContent>Olá</MessageBlockContent>
          </MessageBlock>
        </MessageBlockContainer>

        <MessageBlockContainer>
          <MessageBlock>
            <MessageBlockContent>Tudo bom?</MessageBlockContent>
          </MessageBlock>
        </MessageBlockContainer>
      </ChatMessagesContainer>

      <InputMessageContainer>
        <InputMessage />
        <SendIconContainer>
          <SendIcon />
        </SendIconContainer>
      </InputMessageContainer>
    </Container>
  );
}
