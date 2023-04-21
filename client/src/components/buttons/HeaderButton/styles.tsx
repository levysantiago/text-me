import styled from '@emotion/styled'

interface IHeaderButtonProps {
  isSelected?: boolean
}

export const Title = styled.span(
  (props: IHeaderButtonProps) => `
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: ${props.isSelected ? '#1E222A' : '#fafafa'};
`,
)

export const Container = styled.button(
  (props: IHeaderButtonProps) => `
  padding: 10px 10px;
  background-color: ${props.isSelected ? '#8a4de6' : 'transparent'};
  width: 100px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${props.isSelected ? '#8a4de6' : '#303540'};
  }
`,
)
