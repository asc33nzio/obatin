import styled from 'styled-components';

interface ModalPropsItf {
  $width: string | undefined;
  $height: string | undefined;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $bgColor?: string | undefined;
  disabled?: boolean | undefined;
}

export const ModalContainer = styled.div<ModalPropsItf>`
  display: flex;
  flex-direction: column;

  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
`;
