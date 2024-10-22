/* eslint-disable no-undef */
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Container, Title } from "./styles";

interface IHeaderButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title: string;
  isSelected?: boolean;
}

export function HeaderButton({
  title,
  isSelected,
  ...buttonProps
}: IHeaderButtonProps) {
  return (
    <Container type="button" isSelected={isSelected} {...buttonProps}>
      <Title isSelected={isSelected}>{title}</Title>
    </Container>
  );
}
