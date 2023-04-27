import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`

export const TitleContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
`

export const Title = styled.h1`
  font-family: Roboto, sans-serif;
  font-weight: 700;
  font-size: 25px;
  color: #8a4de6;
`

export const Header = styled.div`
  padding: 0px 20px;
`

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
`

export const MessagesList = styled.div`
  overflow-x: hidden;
  height: 100%;
`

// Add Friend

export const AddFriendContainer = styled.div(
  (props: { show?: boolean }) => `
  background-color: #2a313d;
  position: absolute;
  height: ${props.show ? '40%' : '0px'};
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: 0.3s height;
`,
)

export const AddFriendTitle = styled.h1`
  font-family: Roboto, sans-serif;
  font-weight: 700;
  font-size: 25px;
  color: #8a4de6;
  margin: 20px 0px;
`

export const AddFriendContent = styled.div`
  width: 100%;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const FriendEmailInputContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const CloseFriendContainerIcon = styled.img`
  width: 20px;
  position: absolute;
  right: 20px;
  top: 20px;
`

export const FriendEmailInputTitle = styled.span`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #fafafa;
`

export const AddFriendButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 90%;
`
