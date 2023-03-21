import styled from "styled-components";

export const HeaderButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
  overflow: scroll;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
