import styled from 'styled-components';

interface MessageProps {
  align_self?: string;
}

export const MessageContainer = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-self: ${(props) => props.align_self || 'auto'};
  width: 50%;
  max-width: 50%;
`;
