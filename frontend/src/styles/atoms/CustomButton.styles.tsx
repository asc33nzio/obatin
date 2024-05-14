import styled from 'styled-components';

interface ButtonPropsItf {
  content?: string;
  $width?: string | undefined;
  $height?: string | undefined;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $bgColor?: string | undefined;
  $border?: string | undefined;
  disabled?: boolean | undefined;
}

export const CustomButtonStyle = styled.button<ButtonPropsItf>`
  cursor: pointer;
  width: ${({ $width }) => ($width ? $width : '100%')};
  height: ${({ $height }) => ($height ? $height : '55px')};

  background-color: ${({ $bgColor, disabled }) =>
    $bgColor ? $bgColor : disabled ? '#cbd5e0' : '#00b5c0'};
  color: ${({ $color }) => ($color ? $color : '#f7fafc')};

  border-radius: 10px;
  border: ${({ $border }) => ($border ? `1px solid ${$border}` : 'none')};
  outline: none;

  font-size: ${({ $fontSize }) => ($fontSize ? $fontSize : '24px')};
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }
`;
