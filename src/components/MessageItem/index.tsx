import {
  ContactName,
  Container,
  ContentContainer,
  Time,
  MessagePreview,
  ProfileImage,
} from "./styles";

export function MessageItem() {
  return (
    <Container>
      <ProfileImage />
      <ContentContainer>
        <ContactName>John Duo</ContactName>
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
