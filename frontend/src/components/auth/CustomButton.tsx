import { CustomButtonStyle } from '@/styles/CustomButton.styles';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonItf extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string;
}

const CustomButton = ({
  content = 'Default button content',
  ...props
}: CustomButtonItf): React.ReactElement => {
  return <CustomButtonStyle {...props}>{content}</CustomButtonStyle>;
};

export default CustomButton;
