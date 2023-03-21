import styled from "styled-components";

interface IHeaderButtonProps {
  isSelected?: boolean;
}

export const Title = styled.span`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 12px;
`;

export const Container = styled.div(
  (props: IHeaderButtonProps) => `
  padding: 10px 10px;
  background-color: ${props.isSelected ? "#8a4de6" : "transparent"};
  width: 100px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${props.isSelected ? "#8a4de6" : "#303540"};
  }

  ${Title} {
    color: ${props.isSelected ? "#1E222A" : "#fafafa"};
  }
`
);
