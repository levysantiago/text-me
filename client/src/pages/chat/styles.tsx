import styled from "@emotion/styled";

interface IChatProps {
  isUserMessage?: boolean;
}

export const Container = styled.div`
  width: 100%;
  height: 95%;
  padding: 30px 0px 0px 0px;
`;

export const Header = styled.div`
  background-color: #0a0d14;
  padding: 15px 20px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  border-radius: 40px 40px 0px 0px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BackIconContainer = styled.button`
  width: 25px;
  height: 25px;
  background-color: transparent;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
`;

export const BackIcon = styled.img`
  width: 15px;
  height: 15px;
`;

export const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 100%;
`;

export const ContactName = styled.span`
  font-family: Roboto, sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #fafafa;
`;

export const InputMessageContainer = styled.div`
  display: flex;
  height: 80px;
  border-radius: 0px 0px 40px 40px;
  background-color: transparent;
  padding: 0px 10px;
  gap: 5px;
  align-items: center;
`;

export const InputMessage = styled.input`
  background-color: #0a0d14;
  flex: 1;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 100px;
  padding: 5px 20px;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #fafafa;
`;

export const SendIconContainer = styled.button`
  width: 50px;
  height: 50px;
  background-color: #8a4de6;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
`;

export const SendIcon = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 3px;
`;

// CHAT MESSAGES

export const ChatMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 88%;
  width: 100%;

  overflow-x: hidden;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const MessageBlock = styled.div(
  (props: IChatProps) => `
  width: 50%;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;

  background-color: ${props.isUserMessage ? "#8a4de6" : "#2e323a"};
`,
);

export const MessageBlockContent = styled.span`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #fafafa;
`;

export const MessageBlockContainer = styled.div(
  (props: IChatProps) => `
  display: flex;
  padding: 5px 10px;
  justify-content: ${props.isUserMessage ? "flex-end" : "flex-start"};
`,
);
