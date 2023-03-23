import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <TitleContainer>
          <Title>TextMe</Title>
        </TitleContainer>

        <HeaderButtonsContainer>
          <HeaderButton title="Messages" isSelected />
          <HeaderButton title="Status" />
        </HeaderButtonsContainer>
      </Header>

      <MessagesList>
        <MessageItem
          onClick={() => {
            navigate("/chat");
          }}
        />
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
