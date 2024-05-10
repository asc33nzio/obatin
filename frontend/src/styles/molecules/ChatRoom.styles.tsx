import styled, { css } from 'styled-components';

interface ChatRoomContainerProps {
  height?: string;
  width?: string;
  padding?: string;
  gap?: string;
  border?: string;
  background_color?: string;
  flex_direction?: string;
  align_items?: string;
  is_shadow_active?: boolean;
  border_bottom?: string;
  justify_content?: string;
  hoverEffect?: boolean;
}

export const ChatRoomContainer = styled.div<ChatRoomContainerProps>`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify_content || 'auto'};
  gap: ${(props) => props.gap || '10px'};
  padding: ${(props) => props.padding || '0'};
  border: ${(props) => props.border || 'none'};
  background-color: ${(props) => props.background_color || 'white'};
  flex-direction: ${(props) => props.flex_direction || 'row'};
  align-items: ${(props) => props.align_items || 'start'};
  box-shadow: ${(props) =>
    props.is_shadow_active
      ? '-1px 7px 8px -6px rgba(0, 0, 0, 0.8);'
      : '-1px 7px 8px 0px rgba(0, 0, 0, 0.8);'};
  -webkit-box-shadow: ${(props) =>
    props.is_shadow_active ? '-1px 7px 8px -6px rgba(0, 0, 0, 0.8);' : 'none'};
  -moz-box-shadow: ${(props) =>
    props.is_shadow_active ? '-1px 7px 8px -6px rgba(0, 0, 0, 0.8);' : 'none'};
  z-index: 2;
  border-bottom: ${(props) => props.border_bottom || 'none'};
  cursor: pointer;
  ${(props) =>
    props.hoverEffect &&
    css`
      &:hover {
        background-color: #d7d7d7;
      }
    `}
`;
