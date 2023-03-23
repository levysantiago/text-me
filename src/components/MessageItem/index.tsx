import {
  ContactName,
  Container,
  ContentContainer,
  Time,
  MessagePreview,
  ProfileImage,
} from "./styles";

interface IMessageItemProps {
  onClick?: () => void;
}

export function MessageItem({ onClick }: IMessageItemProps) {
  return (
    <Container onClick={onClick}>
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
