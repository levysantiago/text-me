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
  height: 80vh;
  background-color: #1e222a;
  border-radius: 40px;
  padding: 30px 20px;

  @media (max-width: 450px) {
    width: 100%;
  }
`;
