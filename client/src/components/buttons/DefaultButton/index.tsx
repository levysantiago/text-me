/* eslint-disable no-undef */
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { ButtonContainer, Title } from './styles'

interface IDefaultButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title: string
  backgroundColor?: string
}

export function DefaultButton({
  title,
  backgroundColor,
  ...buttonProps
}: IDefaultButtonProps) {
  return (
    <ButtonContainer {...buttonProps} backgroundColor={backgroundColor}>
      <Title>{title}</Title>
    </ButtonContainer>
  )
}
