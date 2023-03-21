import {
  BackIcon,
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
} from "./styles";

export function Chat() {
  return (
    <Container>
      <Header>
        <BackIcon />
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
        <SendIcon />
      </InputMessageContainer>
    </Container>
  );
}
