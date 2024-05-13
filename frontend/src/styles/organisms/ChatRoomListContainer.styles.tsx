import styled, { keyframes, css } from 'styled-components';

interface ChatRoomSectionProps {
  overFlowY?: string;
  height?: string;
  width?: string;
  isDisplay?: boolean;
}

interface ButtonArrowProps {
  background?: string;
}

export const ChatRoomSection = styled.div<ChatRoomSectionProps>`
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height || 'auto'};
  overflow-y: ${(props) => props.overFlowY || 'none'};

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.isDisplay ? 'block' : 'none')};
  }
`;

export const MessageRoomSection = styled.div<ChatRoomSectionProps>`
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height || 'auto'};
  overflow-y: ${(props) => props.overFlowY || 'none'};
  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (!props.isDisplay ? 'none' : 'block')};
  }
`;

export const ArrowButtonMobileOnly = styled.div<ButtonArrowProps>`
  padding: 10px 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: black;
  display: none;
  background-color: ${(props) => props.background || 'white'};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* @media (max-width: 1440px) {
    display: none;
  } */
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
