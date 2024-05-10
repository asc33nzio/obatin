import styled, { keyframes, css } from 'styled-components';

interface ChatRoomSectionProps {
  overFlowY?: string;
  height?: string;
  width?: string;
}

export const ChatRoomSection = styled.div<ChatRoomSectionProps>`
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height || 'auto'};
  overflow-y: ${(props) => props.overFlowY || 'none'};
`;

const fadeAppearAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface IStyleMessage {
  isLastMessage: boolean;
  role: string;
  sender: string;
}

export const MessageBungkus = styled.div<IStyleMessage>`
  ${({ isLastMessage }) =>
    isLastMessage &&
    css`
      animation: ${fadeAppearAnimation} 0.5s ease-out;
    `}
  align-self: ${({ sender, role }) => (sender === role ? 'end' : 'start')};
  display: flex;
  flex-direction: column;
  gap: 3px;
  /* width: 50%; */
  max-width: 50%;
`;
