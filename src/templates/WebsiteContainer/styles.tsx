import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0px;
`;

export const Main = styled.main`
  width: 350px;
  height: 300px;
  min-height: 500px;
  background-color: #1e222a;
  border-radius: 40px;
  padding: 30px 0px;
  position: relative;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.25);

  @media (max-width: 350px) {
    width: 100%;
  }
`;
