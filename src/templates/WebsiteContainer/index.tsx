import { ReactNode } from "react";
import { Container, Main } from "./styles";

interface IWebsiteContainerProps {
  children: ReactNode;
}

export function WebsiteContainer({ children }: IWebsiteContainerProps) {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  );
}
