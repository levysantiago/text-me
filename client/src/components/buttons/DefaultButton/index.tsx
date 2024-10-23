/* eslint-disable no-undef */
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { ButtonContainer, Title } from "./styles";

interface IDefaultButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title: string;
}

export function DefaultButton({ title, ...buttonProps }: IDefaultButtonProps) {
  return (
    <ButtonContainer {...buttonProps}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
}
