import styled from 'styled-components';

interface ChatRoomPageProps {
  height?: string;
  width?: string;
}

export const ChatRoomPage = styled.div<ChatRoomPageProps>`
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height || 'auto'};
`;
