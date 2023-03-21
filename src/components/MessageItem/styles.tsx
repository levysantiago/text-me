import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  padding: 20px 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #303540;
  }
`;

export const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  background-color: #000;
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
  font-family: Roboto, sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #fafafa;
`;

export const MessagePreview = styled.span`
  font-family: Roboto, sans-serif;
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
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #4f5257;
`;
