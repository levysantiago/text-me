import { useNavigate } from "react-router-dom";
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
        <ProfileImage />
        <ContactName>Name</ContactName>
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
