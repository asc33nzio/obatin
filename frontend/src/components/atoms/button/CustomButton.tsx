import { CustomButtonStyle } from '@/styles/atoms/CustomButton.styles';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonPropsItf extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string;
  $width?: string;
  $height?: string;
  $fontSize?: string;
  $color?: string;

  $bgColor?: string;
  disabled?: boolean;
}

const CustomButton = ({
  content = 'Default button content',
  ...props
}: CustomButtonPropsItf): React.ReactElement => {
  let _test;
  return <CustomButtonStyle {...props}>{content}</CustomButtonStyle>;
};

export default CustomButton;
