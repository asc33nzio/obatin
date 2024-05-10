import styled from 'styled-components';

interface MessageProps {
  background_color?: string;
  align_self?: string;
  color?: string;
  padding?: string;
  font_size?: string;
  border_radius?: string;
}

export const Message = styled.div<MessageProps>`
  background-color: ${(props) => props.background_color || 'white'};
  align-self: ${(props) => props.align_self || 'auto'};
  color: ${(props) => props.color || 'white'};
  padding: ${(props) => props.padding || '15px'};
  font-size: ${(props) => props.font_size || '16px'};
  border-radius: ${(props) => props.border_radius || '10px'};
`;
