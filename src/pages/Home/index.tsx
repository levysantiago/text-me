import { HeaderButton } from "../../components/buttons/HeaderButton";
import { MessageItem } from "../../components/MessageItem";
import {
  Container,
  Header,
  HeaderButtonsContainer,
  MessagesList,
  Title,
  TitleContainer,
} from "./styles";

function Home() {
  return (
    <Container>
      <Header>
        <TitleContainer>
          <Title>TextMe</Title>
        </TitleContainer>

        <HeaderButtonsContainer>
          <HeaderButton title="Messages" isSelected />
          <HeaderButton title="Messages" />
          <HeaderButton title="Messages" />
          <HeaderButton title="Messages" />
          <HeaderButton title="Messages" />
        </HeaderButtonsContainer>
      </Header>

      <MessagesList>
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
        <MessageItem />
      </MessagesList>
    </Container>
  );
}

export default Home;
