/* eslint-disable no-undef */
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { ButtonContainer, Title } from "./styles";

interface IHollowButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title: string;
  backgroundColor?: string;
  titleColor?: string;
}

export function HollowButton({ title, ...buttonProps }: IHollowButtonProps) {
  return (
    <ButtonContainer {...buttonProps}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
}
