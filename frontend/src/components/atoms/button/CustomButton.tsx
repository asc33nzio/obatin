import { CustomButtonStyle } from '@/styles/atoms/CustomButton.styles';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonPropsItf extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string;
  $width?: string;
  $height?: string;
  $fontSize?: string;
  $color?: string;
  $bgColor?: string;
  $border?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const CustomButton = ({
  content = 'Default button content',
  ...props
}: CustomButtonPropsItf): React.ReactElement => {
  return <CustomButtonStyle {...props}>{content}</CustomButtonStyle>;
};

export default CustomButton;
