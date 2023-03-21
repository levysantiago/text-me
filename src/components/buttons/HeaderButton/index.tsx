import { Container, Title } from "./styles";

interface IHeaderButtonProps {
  title: string;
  isSelected?: boolean;
}

export function HeaderButton({ title, isSelected }: IHeaderButtonProps) {
  return (
    <Container isSelected={isSelected}>
      <Title>{title}</Title>
    </Container>
  );
}
