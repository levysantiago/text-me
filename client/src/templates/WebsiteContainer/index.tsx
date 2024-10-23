import { ReactNode } from "react";
import { Container, Main } from "./styles";
import { AppContextProvider } from "components/context/AppContextProvider";

interface IWebsiteContainerProps {
  children: ReactNode;
}

export function WebsiteContainer({ children }: IWebsiteContainerProps) {
  return (
    <AppContextProvider>
      <Container style={{ backgroundColor: "#383b41" }}>
        <Main>{children}</Main>
      </Container>
    </AppContextProvider>
  );
}
