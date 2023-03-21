import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  inset: 0px;
  padding: 50px 0px;
`;

export const Main = styled.main`
  width: 60%;
  min-width: 350px;
  max-width: 500px;
  height: 80vh;
  min-height: 600px;
  background-color: #1e222a;
  border-radius: 40px;
  padding: 30px 0px;
  position: relative;

  @media (max-width: 450px) {
    width: 100%;
  }
`;
