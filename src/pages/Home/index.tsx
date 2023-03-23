import { createSearchParams, useNavigate } from "react-router-dom";
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
          contactName="John Duo"
          onClick={() => {
            navigate({
              pathname: "/chat",
              search: `${createSearchParams({ contactName: "John Duo" })}`,
            });
          }}
        />
        <MessageItem contactName="John Duo2" />
        <MessageItem contactName="John Duo3" />
        <MessageItem contactName="John Duo4" />
        <MessageItem contactName="John Duo5" />
        <MessageItem contactName="John Duo6" />
        <MessageItem contactName="John Duo7" />
        <MessageItem contactName="John Duo8" />
        <MessageItem contactName="John Duo9" />
        <MessageItem contactName="John Duo10" />
        <MessageItem contactName="John Duo11" />
      </MessagesList>
    </Container>
  );
}

export default Home;
