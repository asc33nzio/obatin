import { CustomButtonStyle } from '@/styles/CustomButton.styles';

import { ButtonHTMLAttributes } from 'react';

interface CustomButtonPropsItf extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string;

  $width?: string;

  $height?: string;

  $fontSize?: string;

  $bgColor?: string;
}

const CustomButton = ({
  content = 'Default button content',

  ...props
}: CustomButtonPropsItf): React.ReactElement => {
  return (
    <CustomButtonStyle $buttonProps={{ ...props }} {...props}>
      {content}
    </CustomButtonStyle>
  );
};

export default CustomButton;
