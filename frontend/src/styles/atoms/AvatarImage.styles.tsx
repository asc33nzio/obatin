import styled from 'styled-components';

interface AvatarProps {
  height: string;
  width: string;
}

export const AvatarImage = styled.div<AvatarProps>`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;
