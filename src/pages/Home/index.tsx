import { HeaderButton } from "../../components/buttons/HeaderButton";
import { HeaderButtonsContainer } from "./styles";

function Home() {
  return (
    <HeaderButtonsContainer>
      <HeaderButton title="Messages" isSelected />
      <HeaderButton title="Messages" />
      <HeaderButton title="Messages" />
      <HeaderButton title="Messages" />
      <HeaderButton title="Messages" />
    </HeaderButtonsContainer>
  );
}

export default Home;
