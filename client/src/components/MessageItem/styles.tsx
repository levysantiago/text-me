import styled from "@emotion/styled";
import { Roboto } from "next/font/google";
const robotoRegular = Roboto({ weight: "400", subsets: ["latin"], })
const robotoMedium = Roboto({ weight: "500", subsets: ["latin"], })

export const Container = styled.button`
  position: relative;
  padding: 20px 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  border: none;
  background-color: transparent;
  text-align: start;
  width: 100%;

  &:hover {
    background-color: #303540;
  }
`;

export const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  /* background-color: #000; */
  border-radius: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const ContactName = styled.span`
  font-family: ${robotoMedium.style.fontFamily};
  font-weight: 500;
  font-size: 12px;
  color: #fafafa;
`;

export const MessagePreview = styled.span`
  font-family: ${robotoRegular.style.fontFamily};
  font-size: 11px;
  font-weight: 400;
  color: #4f5257;
  overflow-y: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
`;

export const Time = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: ${robotoRegular.style.fontFamily};
  font-weight: 400;
  font-size: 10px;
  color: #4f5257;
`;
