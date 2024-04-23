import styled from 'styled-components';

interface ButtonPropsItf {
  $width?: string | undefined;
  $height?: string | undefined;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $bgColor?: string | undefined;
  disabled?: boolean | undefined;
}

export const CustomButtonStyle = styled.button<{
  $buttonProps: ButtonPropsItf;
}>`
  cursor: pointer;
  width: ${({ $buttonProps }) =>
    $buttonProps.$width ? $buttonProps.$width : '100%'};
  height: ${({ $buttonProps }) =>
    $buttonProps.$height ? $buttonProps.$height : '55px'};

  background-color: ${({ $buttonProps }) =>
    $buttonProps.$bgColor
      ? $buttonProps.$bgColor
      : $buttonProps.disabled
      ? '#cbd5e0'
      : '#00b5c0'};
  color: ${({ $buttonProps }) =>
    $buttonProps.$color ? $buttonProps.$color : '#f7fafc'};

  border-radius: 10px;
  border: none;
  outline: none;

  font-size: ${({ $buttonProps }) =>
    $buttonProps.$fontSize ? $buttonProps.$fontSize : '24px'};
  font-weight: 600;
`;
